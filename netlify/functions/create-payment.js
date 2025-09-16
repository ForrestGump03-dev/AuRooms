// DEPRECATO: usare backend Flask POST /api/payments/intent
exports.handler = async () => ({
  statusCode: 410,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  },
  body: JSON.stringify({
    deprecated: true,
    message: 'Questa funzione è stata migrata. Usa il backend Flask: POST /api/payments/intent',
    backend: 'https://<render-app>/api/payments/intent'
  })
});
