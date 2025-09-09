// Netlify Function: Create Stripe Payment Intent
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

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

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Stripe non configurato',
        message: 'Aggiungi STRIPE_SECRET_KEY alle variabili d\'ambiente'
      })
    };
  }

  try {
    const { amount, currency = 'eur', metadata = {} } = JSON.parse(event.body);

    if (!amount || amount < 50) { // Minimo €0.50
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Importo non valido',
          message: 'L\'importo deve essere almeno €0.50'
        })
      };
    }

    // Crea Payment Intent con Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe usa centesimi
      currency: currency.toLowerCase(),
      metadata: {
        source: 'AuRooms',
        booking_date: new Date().toISOString(),
        ...metadata
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        client_secret: paymentIntent.client_secret,
        payment_intent_id: paymentIntent.id,
        amount: amount,
        currency: currency,
        status: paymentIntent.status
      })
    };

  } catch (error) {
    console.error('Stripe Error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Errore pagamento',
        message: error.message || 'Errore durante la creazione del pagamento',
        type: error.type || 'unknown_error'
      })
    };
  }
};
