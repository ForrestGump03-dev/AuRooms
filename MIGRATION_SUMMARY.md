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
GOOGLE_REDIRECT_URI=https://<frontend-domain>/auth/google/callback

### Frontend (Netlify – solo ciò che serve davvero ora)
BACKEND_BASE_URL=https://<render-app>.onrender.com/api
STRIPE_PUBLISHABLE_KEY=pk_live_or_test (se usato client-side)

## Guida Deploy su Render (dettagliata)
1. Collegare repo GitHub a Render.
2. New + Web Service.
3. Root directory: `backend`.
4. Build Command: `pip install -r requirements.txt`.
5. Start Command: `gunicorn wsgi:app`.
6. Runtime: Python 3.x.
7. Aggiungere variabili ambiente (vedi sopra).
8. Deploy. Attendere URL finale: es. https://aurooms-backend.onrender.com.
9. Test: `curl https://<render-app>.onrender.com/api/health`.
10. Aggiorna `BACKEND_BASE_URL` in Netlify env e (opzionale) nel tuo `script.js` locale.

### Creare Database Postgres (Render)
1. New + PostgreSQL.
2. Piano Free.
3. Copia Internal Connection String → incolla come DATABASE_URL (modificando `postgres://` in `postgresql://` se necessario).
4. (Opzionale) Usa psql per creare estensioni future.

## Guida Variabili Netlify
1. Site Settings → Environment Variables.
2. Aggiungi:
   - BACKEND_BASE_URL=https://<render-app>.onrender.com/api
   - STRIPE_PUBLISHABLE_KEY=(se necessario)
3. Rimuovi: SUPABASE_* , DATABASE_URL (non più usata lato frontend), GOOGLE_* (per ora finché non reimplementato), STRIPE_SECRET_KEY (tenere solo sul backend), JWT_SECRET (solo backend).
4. Trigger redeploy.

## Schema & Modelli
Schema DB in `backend/schema.sql`. Modelli: Customer, Booking, Payment.

## Prossimi Step
1. Implementare Google OAuth.
2. Endpoint Stripe webhook server side.
3. Hardening sicurezza (limitare CORS, rate limiting, logging strutturato).
4. Aggiungere test automatici.

Ultimo aggiornamento: 16-09-2025
