// Netlify Function: Debug Database Connection
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

  let debugInfo = {};
  
  try {
    // Check if DATABASE_URL exists
    debugInfo.database_url_exists = !!process.env.DATABASE_URL;
    debugInfo.database_url_length = process.env.DATABASE_URL ? process.env.DATABASE_URL.length : 0;
    
    if (process.env.DATABASE_URL) {
      // Parse URL components safely
      try {
        const url = new URL(process.env.DATABASE_URL);
        debugInfo.url_parts = {
          protocol: url.protocol,
          hostname: url.hostname,
          port: url.port,
          pathname: url.pathname,
          username: url.username,
          password_length: url.password ? url.password.length : 0,
          search: url.search,
          searchParams_exists: !!url.searchParams
        };
      } catch (urlError) {
        debugInfo.url_parse_error = urlError.message;
      }
    }

    // Try to create client with different approaches
    let connectionTest = {};
    
    if (process.env.DATABASE_URL) {
      try {
        // Test 1: Direct connection string
        const client1 = new Client({
          connectionString: process.env.DATABASE_URL,
          ssl: { rejectUnauthorized: false }
        });
        connectionTest.direct_string = "Client created successfully";
      } catch (error1) {
        connectionTest.direct_string_error = error1.message;
      }

      try {
        // Test 2: Parse URL manually
        const url = new URL(process.env.DATABASE_URL);
        const client2 = new Client({
          user: url.username,
          password: url.password,
          host: url.hostname,
          port: parseInt(url.port) || 5432,
          database: url.pathname.slice(1), // Remove leading slash
          ssl: { rejectUnauthorized: false }
        });
        connectionTest.manual_parse = "Client created successfully";
      } catch (error2) {
        connectionTest.manual_parse_error = error2.message;
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        status: 'debug_info',
        timestamp: new Date().toISOString(),
        debug: debugInfo,
        connection_tests: connectionTest
      }, null, 2)
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        status: 'error',
        message: 'Debug failed',
        error: error.message,
        debug: debugInfo
      })
    };
  }
};
