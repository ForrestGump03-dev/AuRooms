# 💳 STRIPE SETUP - AuRooms

## 🚀 Setup Rapido

### 1. Crea Account Stripe
- Vai su [stripe.com](https://stripe.com)
- Registrati/Accedi
- Vai su **Developers** → **API Keys**

### 2. Chiavi da Copiare
```
Publishable Key (pk_test_...): [INSERISCI QUI]
Secret Key (sk_test_...): [INSERISCI QUI]
Webhook Secret (whsec_...): [CONFIGURARE DOPO]
```

### 3. Variabili Environment Netlify
```
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx  
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

### 4. Webhook Configuration
- URL Endpoint: `https://aurooms.netlify.app/.netlify/functions/stripe-webhook`
- Eventi da ascoltare:
  - `payment_intent.succeeded`
  - `payment_intent.payment_failed`
  - `checkout.session.completed`

## 📋 Status
- [ ] Account Stripe creato
- [ ] API Keys ottenute  
- [ ] Variabili aggiunte a Netlify
- [ ] Webhook configurato
- [ ] Test pagamento effettuato

## 💰 Prezzi AuRooms
```javascript
const prezziCamere = {
  'Camera Glicine': { prezzo: 85, descrizione: 'Camera matrimoniale con balcone' },
  'Camera Standard': { prezzo: 70, descrizione: 'Camera confortevole' },
  'Suite Premium': { prezzo: 120, descrizione: 'Suite con tutti i comfort' }
};
```

---
*Ultimo aggiornamento: 9 settembre 2025*
