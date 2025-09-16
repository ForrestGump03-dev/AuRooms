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

## Variabili Ambiente (.env)
```
DATABASE_URL=postgresql://user:password@host:5432/dbname
APP_SECRET=supersegretokey
JWT_SECRET=jwtsecret123
```

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

Endpoint principali:
- GET /api/health
- GET /api/bookings
- POST /api/bookings
- POST /api/payments/record
- POST /api/auth/token
