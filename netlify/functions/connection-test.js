// DEPRECATO: test connessione gestito dal backend Flask
exports.handler = async () => ({
  statusCode: 410,
  headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  body: JSON.stringify({ deprecated: true })
});
