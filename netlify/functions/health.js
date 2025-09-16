// DEPRECATO: usare backend Flask /api/health
exports.handler = async () => ({
  statusCode: 410,
  headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  body: JSON.stringify({ deprecated: true, backend: 'https://<render-app>/api/health' })
});
