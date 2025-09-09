// Netlify Function: Simple Database Test (without pg library)
// This tests if the issue is with the pg library specifically

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
    // Step 1: Check if we can load the pg module at all
    let pgModule;
    try {
      pgModule = require('pg');
    } catch (pgError) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          status: 'error',
          step: 'require_pg',
          message: 'Failed to require pg module',
          error: pgError.message
        })
      };
    }

    // Step 2: Check DATABASE_URL
    if (!process.env.DATABASE_URL) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          status: 'error',
          step: 'check_env',
          message: 'DATABASE_URL not configured'
        })
      };
    }

    // Step 3: Try to parse URL
    let parsedUrl;
    try {
      parsedUrl = new URL(process.env.DATABASE_URL);
    } catch (urlError) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          status: 'error',
          step: 'parse_url',
          message: 'Failed to parse DATABASE_URL',
          error: urlError.message
        })
      };
    }

    // Step 4: Try to create client (without connecting)
    let client;
    try {
      const { Client } = pgModule;
      client = new Client({
        user: parsedUrl.username,
        password: parsedUrl.password,
        host: parsedUrl.hostname,
        port: parseInt(parsedUrl.port) || 5432,
        database: parsedUrl.pathname.slice(1),
        ssl: { rejectUnauthorized: false }
      });
    } catch (clientError) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          status: 'error',
          step: 'create_client',
          message: 'Failed to create client',
          error: clientError.message,
          stack: clientError.stack
        })
      };
    }

    // Step 5: Try to connect
    try {
      await client.connect();
      
      // Step 6: Try a simple query
      const result = await client.query('SELECT 1 as test');
      await client.end();
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          status: 'success',
          message: 'All steps completed successfully!',
          result: result.rows[0]
        })
      };
      
    } catch (connectError) {
      try {
        await client.end();
      } catch (e) {}
      
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          status: 'error',
          step: 'connect_or_query',
          message: 'Failed during connection or query',
          error: connectError.message,
          stack: connectError.stack,
          name: connectError.name,
          code: connectError.code
        })
      };
    }

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        status: 'error',
        step: 'general',
        message: 'Unexpected error',
        error: error.message,
        stack: error.stack
      })
    };
  }
};
