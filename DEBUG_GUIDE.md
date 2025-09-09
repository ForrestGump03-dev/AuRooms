# Debug Checklist per AuRooms Backend

## Se la Test Dashboard non funziona...

### 1. Verifica Deploy Netlify
- Vai su netlify.app
- Login al tuo account
- Controlla che il sito sia deployato
- Verifica build logs per errori

### 2. Controlla Variabili Ambiente
Le seguenti variabili DEVONO essere configurate in Netlify:

```
DATABASE_URL=your_database_connection_string
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
JWT_SECRET=your_jwt_secret
```

### 3. Verifica Netlify Functions
- Controlla che la cartella `/netlify/functions/` esista
- Verifica che i file .js siano presenti
- Controlla Function logs in Netlify Dashboard

### 4. Test Manuale URLs
Prova questi URL direttamente nel browser:

- `https://tuosito.netlify.app/.netlify/functions/health`
- `https://tuosito.netlify.app/.netlify/functions/db-test`

### 5. Browser DevTools
- Apri F12 nel browser
- Vai su Network tab
- Esegui i test e controlla gli errori

### 6. Common Errors & Solutions

**CORS Error:**
```javascript
// In ogni function, aggiungi:
return {
  statusCode: 200,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE"
  },
  body: JSON.stringify(data)
}
```

**Database Connection Error:**
- Verifica DATABASE_URL
- Controllo che il database sia accessibile
- Test credenziali database

**Google Auth Error:**
- Verifica GOOGLE_CLIENT_ID
- Controllo redirect URLs in Google Console
- Test domini autorizzati

**Stripe Error:**
- Verifica STRIPE_SECRET_KEY
- Controllo che sia test key (sk_test_)
- Test webhook endpoint

## Quick Test Commands

```bash
# Test health endpoint
curl https://tuosito.netlify.app/.netlify/functions/health

# Test database
curl https://tuosito.netlify.app/.netlify/functions/db-test

# Check deploy status
netlify status
```
