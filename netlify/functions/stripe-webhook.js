// DEPRECATO: gestire webhook nel backend Flask (futuro /api/payments/webhook)
exports.handler = async () => ({
  statusCode: 410,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  },
  body: JSON.stringify({
    deprecated: true,
    message: 'Questa funzione è stata migrata. Webhook Stripe sarà gestito nel backend Flask.',
    backend: 'https://<render-app>/api/payments/webhook'
  })
});
