# MIGRATION SUMMARY (Supabase/Netlify -> Flask + Render)

Frontend resta su Netlify. Backend migrato a Flask (`backend/`). Le vecchie funzioni Netlify ora rispondono 410 (Gone) per evitare rotture durante la transizione.

## Backend Flask Endpoint
GET /api/health
GET /api/bookings
POST /api/bookings
POST /api/payments/intent
POST /api/payments/record
POST /api/auth/token
// (Placeholder) GET /api/auth/google/start

## Variabili ambiente consolidate

### Backend (Render)
DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<db>
APP_SECRET=<flask_secret>
JWT_SECRET=<jwt_secret>
STRIPE_SECRET_KEY=sk_live_or_test
STRIPE_PUBLISHABLE_KEY=pk_live_or_test
STRIPE_WEBHOOK_SECRET=whsec_xxx (quando aggiungeremo il webhook)
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com (futuro)
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxx (futuro)
GOOGLE_REDIRECT_URI=https://<frontend-domain>/auth/google/callback (da allineare al blueprint Flask quando implementato)

### Frontend (Netlify – solo ciò che serve davvero ora)
BACKEND_BASE_URL=https://<render-app>.onrender.com/api
STRIPE_PUBLISHABLE_KEY=pk_live_or_test (se usato client-side)
EMAILJS_SERVICE_ID=<id opzionale>
EMAILJS_TEMPLATE_ID=<id opzionale>
EMAILJS_PUBLIC_KEY=<public key opzionale>

### Note sicurezza
- Evitare di lasciare in repo variabili reali (usare Netlify + Render dashboard).
- Rimuovere vecchie variabili Supabase inutilizzate.
- Password legacy Supabase NON più necessaria: Abcde01030915 (non riutilizzare in produzione per sicurezza).

## Stato Pulizia Documenti
- Obsoleti da rimuovere: SUPABASE_SETUP.md, HOW_TO_GET_DATABASE_URL.md, ENVIRONMENT_VARIABLES.md, GOOGLE_OAUTH_SETUP.md (verrà reinserito dopo implementazione reale), STRIPE_SETUP.md (contenuto integrato qui / README backend), DEBUG_GUIDE.md, TEST_PLAN.md, replit.md, ADMIN_ACCESS.md.
- Conservare solo: MIGRATION_SUMMARY.md, backend/README.md.

## Schema & Modelli
Schema DB in `backend/schema.sql`. Modelli: Customer, Booking, Payment.

## Prossimi Step
1. Creare servizio Render Postgres e aggiornare DATABASE_URL.
2. Eseguire migrazione iniziale (Flask-Migrate) se introdotta più avanti.
3. Aggiornare `script.js` con BACKEND_BASE_URL reale.
4. Implementare Google OAuth sul backend (sostituendo vecchie function Netlify).
5. Implementare endpoint webhook Stripe (server side) e rimuovere completamente vecchio stripe-webhook.
6. Aggiungere test rapidi curl nel README backend.

Ultimo aggiornamento: 16-09-2025
