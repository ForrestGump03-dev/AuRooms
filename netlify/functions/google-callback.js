// Netlify Function: Google OAuth Callback
const jwt = require('jsonwebtoken');

exports.handler = async (event, context) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET"
  };

  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return {
      statusCode: 500,
      headers: {
        ...headers,
        'Content-Type': 'text/html'
      },
      body: `
        <html>
          <body>
            <h2>❌ Errore Configurazione</h2>
            <p>Google OAuth non configurato correttamente.</p>
            <p><a href="/">Torna alla home</a></p>
          </body>
        </html>
      `
    };
  }

  const { code, state, error } = event.queryStringParameters || {};

  if (error) {
    return {
      statusCode: 400,
      headers: {
        ...headers,
        'Content-Type': 'text/html'
      },
      body: `
        <html>
          <body>
            <h2>❌ Errore Autenticazione</h2>
            <p>Errore: ${error}</p>
            <p><a href="/">Torna alla home</a></p>
          </body>
        </html>
      `
    };
  }

  if (!code) {
    return {
      statusCode: 400,
      headers: {
        ...headers,
        'Content-Type': 'text/html'
      },
      body: `
        <html>
          <body>
            <h2>❌ Codice Mancante</h2>
            <p>Codice di autorizzazione mancante.</p>
            <p><a href="/">Torna alla home</a></p>
          </body>
        </html>
      `
    };
  }

  try {
    // Scambia il code per un access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: process.env.GOOGLE_REDIRECT_URI || `${process.env.URL}/.netlify/functions/google-callback`,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      throw new Error('Token di accesso non ricevuto');
    }

    // Ottieni informazioni utente da Google
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const userData = await userResponse.json();

    if (!userData.email) {
      throw new Error('Informazioni utente non ricevute');
    }

    // Crea JWT token per l'utente
    const jwtSecret = process.env.JWT_SECRET || 'default-secret-change-me';
    const jwtToken = jwt.sign(
      {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        picture: userData.picture,
        verified_email: userData.verified_email,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 ore
      },
      jwtSecret
    );

    // Ritorna HTML che imposta il token e chiude la finestra
    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': 'text/html'
      },
      body: `
        <html>
          <body>
            <h2>✅ Login Riuscito!</h2>
            <p>Benvenuto, ${userData.name}!</p>
            <p>Chiudo la finestra e ti ridireziono...</p>
            
            <script>
              // Salva token nel localStorage
              localStorage.setItem('aurooms_token', '${jwtToken}');
              localStorage.setItem('aurooms_user', JSON.stringify({
                id: '${userData.id}',
                email: '${userData.email}',
                name: '${userData.name || ''}',
                picture: '${userData.picture || ''}',
                verified: ${userData.verified_email || false}
              }));
              
              // Ricarica la pagina parent e chiudi popup
              if (window.opener) {
                window.opener.location.reload();
                window.close();
              } else {
                window.location.href = '/';
              }
            </script>
          </body>
        </html>
      `
    };

  } catch (error) {
    console.error('Google OAuth Error:', error);
    
    return {
      statusCode: 500,
      headers: {
        ...headers,
        'Content-Type': 'text/html'
      },
      body: `
        <html>
          <body>
            <h2>❌ Errore Server</h2>
            <p>Errore durante l'autenticazione: ${error.message}</p>
            <p><a href="/">Torna alla home</a></p>
          </body>
        </html>
      `
    };
  }
};
