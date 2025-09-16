// DEPRECATO: Google OAuth gestito dal backend Flask /api/auth/google/start
exports.handler = async () => ({
  statusCode: 410,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  },
  body: JSON.stringify({
    deprecated: true,
    message: 'Questa funzione è stata migrata. Usa il backend Flask: /api/auth/google/start',
    backend: 'https://<render-app>/api/auth/google/start'
  })
});
