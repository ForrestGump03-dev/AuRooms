// Netlify Function: Google OAuth Login
exports.handler = async (event, context) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET"
  };

  if (!process.env.GOOGLE_CLIENT_ID) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Google OAuth non configurato',
        message: 'Aggiungi GOOGLE_CLIENT_ID alle variabili d\'ambiente'
      })
    };
  }

  // Parametri per Google OAuth
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${process.env.URL}/.netlify/functions/google-callback`;
  const scope = 'email profile';
  const state = Math.random().toString(36).substring(7); // Token CSRF

  // Costruisci URL di autorizzazione Google
  const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  googleAuthUrl.searchParams.append('client_id', googleClientId);
  googleAuthUrl.searchParams.append('redirect_uri', redirectUri);
  googleAuthUrl.searchParams.append('response_type', 'code');
  googleAuthUrl.searchParams.append('scope', scope);
  googleAuthUrl.searchParams.append('state', state);
  googleAuthUrl.searchParams.append('access_type', 'offline');

  // Se è una richiesta GET diretta, fai redirect
  if (event.httpMethod === 'GET') {
    return {
      statusCode: 302,
      headers: {
        ...headers,
        'Location': googleAuthUrl.toString()
      },
      body: ''
    };
  }

  // Se è una richiesta AJAX, restituisci l'URL
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      success: true,
      auth_url: googleAuthUrl.toString(),
      state: state,
      message: 'Redirect a Google per l\'autenticazione'
    })
  };
};
