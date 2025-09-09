// Netlify Function: Database Test
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
        message: 'DATABASE_URL not configured',
        suggestion: 'Add DATABASE_URL to Netlify Environment Variables'
      })
    };
  }

  let client;
  
  try {
    // Test connection
    client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    });

    await client.connect();
    
    // Test basic query
    const result = await client.query('SELECT NOW() as current_time, version() as postgres_version');
    
    // Test tables existence
    const tablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;
    
    const tablesResult = await tablesQuery ? await client.query(tablesQuery) : { rows: [] };
    
    const response = {
      status: 'success',
      message: 'Database connection successful!',
      timestamp: new Date().toISOString(),
      database: {
        connected: true,
        server_time: result.rows[0].current_time,
        postgres_version: result.rows[0].postgres_version,
        tables: tablesResult.rows.map(row => row.table_name)
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
        message: 'Database connection failed',
        error: error.message,
        suggestion: 'Check DATABASE_URL format and Supabase credentials'
      })
    };
  } finally {
    if (client) {
      try {
        await client.end();
      } catch (e) {
        console.error('Error closing database connection:', e);
      }
    }
  }
};
