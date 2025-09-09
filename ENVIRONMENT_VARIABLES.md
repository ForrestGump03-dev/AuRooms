# 🔧 VARIABILI D'AMBIENTE NETLIFY - AuRooms

## 📋 Lista Completa Variabili Necessarie

### Database (Supabase) 
```
DATABASE_URL=postgresql://postgres:Abcde01030915@db.khpamatawazugmttayui.supabase.co:5432/postgres
SUPABASE_URL=https://khpamatawazugmttayui.supabase.co
SUPABASE_ANON_KEY=[DA COPIARE DA SUPABASE]
```

### Pagamenti (Stripe) ⭐ DA CONFIGURARE
```
STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
STRIPE_SECRET_KEY=sk_test_xxxxx  
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

### Autenticazione (Google OAuth) ⭐ DA CONFIGURARE
```
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxx
GOOGLE_REDIRECT_URI=https://aurooms.netlify.app/.netlify/functions/google-callback
JWT_SECRET=il_tuo_jwt_secret_super_sicuro_123
```

### Email (EmailJS) - Già configurato
```
EMAILJS_SERVICE_ID=[GIÀ PRESENTE]
EMAILJS_TEMPLATE_ID=[GIÀ PRESENTE] 
EMAILJS_PUBLIC_KEY=[GIÀ PRESENTE]
```

## 🚀 Come Aggiungere su Netlify

1. Vai su [netlify.com](https://netlify.com) → Il tuo sito
2. **Site settings** → **Environment variables**  
3. Clicca **Add variable**
4. Inserisci **Key** e **Value** per ogni variabile
5. Clicca **Save**

## ✅ Status Configuration

- [x] Database URL aggiornata
- [ ] **Stripe keys** - DA FARE
- [ ] **Google OAuth** - DA FARE  
- [x] EmailJS configurato
- [ ] JWT Secret generato

---
*Prossimi passi: Configurare Stripe e Google OAuth*
