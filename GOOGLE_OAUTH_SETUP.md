# 🔐 GOOGLE OAUTH SETUP - AuRooms

## 🚀 Setup Rapido

### 1. Google Cloud Console
- Vai su [console.cloud.google.com](https://console.cloud.google.com)
- Crea nuovo progetto "AuRooms"
- Abilita "Google+ API" e "People API"

### 2. Credenziali OAuth
- APIs & Services → Credentials
- Create Credentials → OAuth 2.0 Client ID
- Application Type: **Web Application**

### 3. URL Autorizzati
```
Authorized JavaScript origins:
- https://aurooms.netlify.app
- http://localhost:8888 (per sviluppo)

Authorized redirect URIs:
- https://aurooms.netlify.app/auth/callback
- https://aurooms.netlify.app/.netlify/functions/google-callback
```

### 4. Chiavi da Copiare
```
Client ID: [INSERISCI QUI - tipo: xxxxx.apps.googleusercontent.com]
Client Secret: [INSERISCI QUI - tipo: GOCSPX-xxxxx]
```

### 5. Variabili Environment Netlify
```
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxx
GOOGLE_REDIRECT_URI=https://aurooms.netlify.app/.netlify/functions/google-callback
JWT_SECRET=il_tuo_jwt_secret_super_sicuro_123
```

## 📋 Status
- [ ] Google Cloud Project creato
- [ ] OAuth Client configurato
- [ ] Variabili aggiunte a Netlify
- [ ] Test login effettuato

## 🎯 Flusso Autenticazione
1. User clicca "Login con Google"
2. Redirect a Google OAuth
3. Google redirect a `/google-callback`
4. Server crea JWT token
5. User autenticato nel frontend

---
*Ultimo aggiornamento: 9 settembre 2025*
