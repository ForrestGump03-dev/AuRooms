// Test di connessione semplificato per diagnosticare il problema
exports.handler = async (event, context) => {
  try {
    // Log delle variabili d'ambiente (senza mostrare la password)
    const dbUrl = process.env.DATABASE_URL;
    
    if (!dbUrl) {
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          status: 'error',
          message: 'DATABASE_URL not found in environment variables',
          env_vars: Object.keys(process.env).filter(key => key.includes('DATABASE') || key.includes('SUPABASE'))
        })
      };
    }

    // Parsing dell'URL per vedere i componenti
    let parsedUrl;
    try {
      parsedUrl = new URL(dbUrl);
    } catch (parseError) {
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          status: 'error',
          message: 'Invalid DATABASE_URL format',
          error: parseError.message,
          url_preview: dbUrl.substring(0, 30) + '...'
        })
      };
    }

    // Test di connessione DNS
    const dns = require('dns').promises;
    let dnsResult;
    try {
      dnsResult = await dns.lookup(parsedUrl.hostname);
    } catch (dnsError) {
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          status: 'error',
          message: 'DNS lookup failed',
          hostname: parsedUrl.hostname,
          error: dnsError.message,
          suggestion: 'Check if Supabase project is active and hostname is correct'
        })
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        status: 'success',
        message: 'Connection test passed',
        hostname: parsedUrl.hostname,
        resolved_ip: dnsResult.address,
        port: parsedUrl.port,
        database: parsedUrl.pathname.substring(1)
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        status: 'error',
        message: 'Unexpected error',
        error: error.message
      })
    };
  }
};
