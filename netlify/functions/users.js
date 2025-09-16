// DEPRECATO: usare backend Flask /api (users endpoint futuro)
exports.handler = async () => ({
  statusCode: 410,
  headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  body: JSON.stringify({ deprecated: true, backend: 'https://<render-app>/api' })
});
