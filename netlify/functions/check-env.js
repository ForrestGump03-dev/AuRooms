// Netlify Function per testare le variabili d'ambiente
// Salva questo come netlify/functions/check-env.js

exports.handler = async (event, context) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE"
  };

  // Lista delle variabili da controllare (senza mostrare i valori)
  const requiredVars = [
    'DATABASE_URL',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET', 
    'STRIPE_SECRET_KEY',
    'STRIPE_PUBLISHABLE_KEY',
    'JWT_SECRET',
    'FLASK_SECRET_KEY'
  ];

  const envStatus = {};
  
  requiredVars.forEach(varName => {
    const value = process.env[varName];
    envStatus[varName] = {
      exists: !!value,
      hasValue: value && value.length > 0,
      preview: value ? `${value.substring(0, 8)}...` : 'NOT_SET'
    };
  });

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      message: "Environment Variables Check",
      timestamp: new Date().toISOString(),
      variables: envStatus,
      allConfigured: Object.values(envStatus).every(v => v.exists && v.hasValue)
    })
  };
};
