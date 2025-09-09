// Netlify Function: Health Check
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

  try {
    const response = {
      status: 'healthy',
      message: 'AuRooms Backend is running!',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: process.env.ENVIRONMENT || 'development',
      functions: {
        health: '✅ Active',
        database: process.env.DATABASE_URL ? '🔗 Configured' : '❌ Missing DATABASE_URL',
        stripe: process.env.STRIPE_SECRET_KEY ? '💳 Configured' : '❌ Missing Stripe keys',
        google: process.env.GOOGLE_CLIENT_ID ? '🔐 Configured' : '❌ Missing Google OAuth'
      }
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response)
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        status: 'error',
        message: 'Health check failed',
        error: error.message
      })
    };
  }
};
