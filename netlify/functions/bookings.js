// DEPRECATO: usare backend Flask /api/bookings
exports.handler = async () => ({
  statusCode: 410,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  },
  body: JSON.stringify({
    deprecated: true,
    message: 'Questa funzione è stata migrata. Usa il backend Flask: /api/bookings',
    backend: 'https://<render-app>/api/bookings'
  })
});
