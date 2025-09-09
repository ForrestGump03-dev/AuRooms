// Netlify Function: Bookings (semplificata per test)
const { Client } = require('pg');

exports.handler = async (event, context) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE"
  };

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (!process.env.DATABASE_URL) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        status: 'error',
        message: 'Database not configured'
      })
    };
  }

  let client;

  try {
    client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });

    await client.connect();

    if (event.httpMethod === 'GET') {
      // Get bookings with client info
      const result = await client.query(`
        SELECT 
          p.id, p.check_in, p.check_out, p.numero_ospiti, p.prezzo_totale, p.stato,
          p.created_at, p.booking_reference,
          c.nome, c.cognome, c.email
        FROM prenotazioni p 
        LEFT JOIN clienti c ON p.client_id = c.id 
        ORDER BY p.created_at DESC 
        LIMIT 20
      `);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          status: 'success',
          data: result.rows,
          count: result.rows.length
        })
      };

    } else if (event.httpMethod === 'POST') {
      // Create booking (simplified)
      const { checkin, checkout, guests, nome, cognome, email, telefono } = JSON.parse(event.body);
      
      if (!checkin || !checkout || !nome || !cognome || !email) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            status: 'error',
            message: 'Dati mancanti: checkin, checkout, nome, cognome, email sono obbligatori'
          })
        };
      }

      // Calculate nights and price
      const checkInDate = new Date(checkin);
      const checkOutDate = new Date(checkout);
      const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
      const pricePerNight = 80; // Default price
      const totalPrice = nights * pricePerNight;

      // Generate booking reference
      const bookingRef = `AR${Date.now().toString().slice(-6)}`;

      // Start transaction
      await client.query('BEGIN');

      // Create or get client
      let clientResult = await client.query('SELECT id FROM clienti WHERE email = $1', [email]);
      let clientId;

      if (clientResult.rows.length === 0) {
        // Create new client
        const newClient = await client.query(
          'INSERT INTO clienti (nome, cognome, email, telefono, gdpr_consent) VALUES ($1, $2, $3, $4, $5) RETURNING id',
          [nome, cognome, email, telefono || null, true]
        );
        clientId = newClient.rows[0].id;
      } else {
        clientId = clientResult.rows[0].id;
      }

      // Create booking
      const bookingResult = await client.query(
        `INSERT INTO prenotazioni 
         (client_id, check_in, check_out, numero_ospiti, prezzo_totale, prezzo_per_notte, numero_notti, booking_reference, stato) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
         RETURNING *`,
        [clientId, checkin, checkout, guests || 2, totalPrice, pricePerNight, nights, bookingRef, 'pending']
      );

      await client.query('COMMIT');

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({
          status: 'success',
          message: 'Prenotazione creata con successo',
          data: {
            ...bookingResult.rows[0],
            cliente: { nome, cognome, email }
          }
        })
      };
    }

  } catch (error) {
    if (client) {
      try {
        await client.query('ROLLBACK');
      } catch (e) {
        console.error('Error rolling back transaction:', e);
      }
    }

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        status: 'error',
        message: 'Booking operation failed',
        error: error.message
      })
    };
  } finally {
    if (client) {
      try {
        await client.end();
      } catch (e) {
        console.error('Error closing connection:', e);
      }
    }
  }
};
