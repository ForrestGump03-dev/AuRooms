# AuRooms Backend (Flask)

Backend indipendente che sostituisce Supabase + Netlify Functions.

## Stack
- Flask + SQLAlchemy + Flask-Migrate
- PostgreSQL (Render / Neon)
- JWT (autenticazione semplice)

## Struttura
```
backend/
  app/
    __init__.py
    models/
      customer.py
      booking.py
      payment.py
    blueprints/
      health.py
      bookings.py
      payments.py
      auth.py
  wsgi.py
```

## Variabili Ambiente Backend (Render)
```
DATABASE_URL=postgresql://user:password@host:5432/dbname
APP_SECRET=supersegretokey
JWT_SECRET=jwtsecret123
STRIPE_SECRET_KEY=sk_test_xxx (opzionale ora)
STRIPE_PUBLISHABLE_KEY=pk_test_xxx (se usato lato client)
STRIPE_WEBHOOK_SECRET=whsec_xxx (quando aggiungiamo webhook)
GOOGLE_CLIENT_ID=<in futuro>
GOOGLE_CLIENT_SECRET=<in futuro>
```

## Variabili Frontend (Netlify)
Solo quelle realmente necessarie lato browser:
```
BACKEND_BASE_URL=https://<render-app>.onrender.com/api
STRIPE_PUBLISHABLE_KEY=pk_test_xxx (se pagamento carta diretto)
```
Rimuovere variabili Supabase obsolete.

## Migrazioni
In locale:
```
pip install -r requirements.txt
cd backend
flask db init
flask db migrate -m "init"
flask db upgrade
```

## Avvio locale
```
cd backend
python wsgi.py
```

## Test Rapidi (curl)
```
curl -s http://127.0.0.1:5000/api/health | jq
curl -s -X POST http://127.0.0.1:5000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{"nome":"Mario","cognome":"Rossi","email":"mario@example.com","checkin":"2025-09-20","checkout":"2025-09-22","guests":2}'
```

Endpoint principali:
- GET /api/health
- GET /api/bookings
- POST /api/bookings
- POST /api/payments/record
- POST /api/auth/token
- POST /api/payments/intent

## Deployment su Render (Sintesi)
1. Creare nuovo servizio Web → Python → repo GitHub.
2. Build command: `pip install -r backend/requirements.txt`.
3. Start command: `gunicorn wsgi:app` (working dir: backend).
4. Impostare env (DATABASE_URL, APP_SECRET, JWT_SECRET, STRIPE_* se serve).
5. Deploy.

## Note
Le vecchie Netlify Functions sono deprecate (410). Usare esclusivamente questi endpoint.
