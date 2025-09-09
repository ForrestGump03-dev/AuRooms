// Netlify Function: Stripe Webhook Handler
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Stripe-Signature",
    "Access-Control-Allow-Methods": "POST"
  };

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Webhook secret non configurato'
      })
    };
  }

  let stripeEvent;

  try {
    const sig = event.headers['stripe-signature'];
    stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({
        error: 'Invalid signature'
      })
    };
  }

  try {
    // Gestisci diversi tipi di eventi
    switch (stripeEvent.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(stripeEvent.data.object);
        break;
        
      case 'payment_intent.payment_failed':
        await handlePaymentFailed(stripeEvent.data.object);
        break;
        
      case 'checkout.session.completed':
        await handleCheckoutCompleted(stripeEvent.data.object);
        break;
        
      default:
        console.log(`Unhandled event type: ${stripeEvent.type}`);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        received: true,
        event_type: stripeEvent.type
      })
    };

  } catch (error) {
    console.error('Webhook processing error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Webhook processing failed'
      })
    };
  }
};

// Gestione pagamento riuscito
async function handlePaymentSucceeded(paymentIntent) {
  console.log('💚 Pagamento riuscito:', {
    id: paymentIntent.id,
    amount: paymentIntent.amount / 100,
    currency: paymentIntent.currency,
    metadata: paymentIntent.metadata
  });

  // TODO: Salvare nel database quando sarà pronto
  // TODO: Inviare email di conferma
  // TODO: Aggiornare stato prenotazione
}

// Gestione pagamento fallito
async function handlePaymentFailed(paymentIntent) {
  console.log('❌ Pagamento fallito:', {
    id: paymentIntent.id,
    last_payment_error: paymentIntent.last_payment_error
  });

  // TODO: Notificare cliente del fallimento
  // TODO: Liberare camera/data prenotata
}

// Gestione checkout completato
async function handleCheckoutCompleted(session) {
  console.log('✅ Checkout completato:', {
    id: session.id,
    payment_status: session.payment_status,
    customer_email: session.customer_email
  });

  // TODO: Finalizzare prenotazione
  // TODO: Inviare conferma booking
}
