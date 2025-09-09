// Netlify Function: Users (semplificata per test)
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
      // Get users
      const result = await client.query('SELECT id, nome, cognome, email, created_at FROM clienti ORDER BY created_at DESC LIMIT 10');
      
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
      // Create user
      const { nome, cognome, email, telefono } = JSON.parse(event.body);
      
      if (!nome || !cognome || !email) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({
            status: 'error',
            message: 'Nome, cognome e email sono obbligatori'
          })
        };
      }

      const result = await client.query(
        'INSERT INTO clienti (nome, cognome, email, telefono, gdpr_consent) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [nome, cognome, email, telefono || null, true]
      );

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({
          status: 'success',
          message: 'Utente creato con successo',
          data: result.rows[0]
        })
      };
    }

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        status: 'error',
        message: 'Database operation failed',
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
