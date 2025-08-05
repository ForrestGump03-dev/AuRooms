# 🏠 AUROOMS Guest House - Area Amministrazione

## 🔐 Accesso Admin

### Credenziali di Default
- **Username**: `admin`
- **Password**: `admin`

### Link di Accesso
- **URL**: `admin-login.html`
- **Accesso rapido**: Clicca l'icona ⚙️ nel footer del sito

## 📊 Funzionalità Dashboard Admin

### 1. Dashboard Principale
- 📈 Statistiche in tempo reale
- 📋 Attività recente
- 💰 Fatturato totale
- 🏦 Bonifici in attesa

### 2. Gestione Prenotazioni
- 📋 Visualizza tutte le prenotazioni
- ✅ Conferma pagamenti
- 📥 Esporta dati in CSV
- 👁️ Dettagli prenotazioni

### 3. Gestione Bonifici
- 🏦 Lista bonifici in attesa
- ✅ Conferma ricezione pagamenti
- 📧 Invio automatico email di conferma
- 📋 Copia dettagli bancari

### 4. Database Clienti
- 👥 Lista clienti registrati
- 💰 Totale spesa per cliente
- 📊 Statistiche attività
- 📥 Esportazione dati

### 5. Impostazioni
- 🔑 Cambio password admin
- 📧 Configurazione EmailJS
- 🏦 Coordinate bancarie
- ⚙️ Configurazioni sistema

## 🔒 Sicurezza

### Protezione Accesso
- ✅ Login con username/password
- ✅ Sessione con timeout (8 ore)
- ✅ Controllo autenticazione su ogni pagina
- ✅ Logout sicuro

### Best Practices
- 🔄 Cambia la password periodicamente
- 🚫 Non condividere le credenziali
- 💻 Usa sempre il logout quando finisci
- 🔒 Accedi solo da dispositivi sicuri

## 📱 Compatibilità
- ✅ Desktop (esperienza ottimale)
- ✅ Tablet (layout responsive)
- ⚠️ Mobile (funzionalità ridotte)

## 🛠️ Struttura File
```
/
├── admin-login.html      ← Pagina login admin
├── admin-dashboard.html  ← Dashboard principale
├── pagamento.html        ← Pagina clienti (integrata con sistema)
└── index.html           ← Homepage (link admin nel footer)
```

## 🎯 Flusso di Lavoro Bonifici

### Per il Cliente:
1. Cliente sceglie "Bonifico Bancario"
2. Riceve email con coordinate bancarie
3. Vede messaggio "Richiesta bonifico inviata"
4. NON riceve conferma immediata

### Per l'Admin:
1. Accedi a `admin-login.html`
2. Vai su "🏦 Bonifici"
3. Vedi lista bonifici in attesa
4. Quando ricevi il pagamento, clicca "✅ Conferma"
5. ✅ Email di conferma inviata automaticamente al cliente

## 🚀 Vantaggi del Sistema

### Organizzazione
- 📊 Tutto centralizzato in un dashboard
- 🔍 Visibilità completa su prenotazioni e pagamenti
- 📈 Statistiche in tempo reale

### Automazione
- 📧 Email automatiche coordinate bancarie
- ✅ Email conferma al clic di un pulsante
- 💾 Salvataggio automatico dati

### Professionalità
- 🎨 Interfaccia moderna e pulita
- 📱 Responsive design
- 🔒 Sicurezza integrata

## 📞 Supporto
Per assistenza tecnica o modifiche al sistema, contatta lo sviluppatore.

---
**AUROOMS Guest House** - Sistema di gestione prenotazioni v1.0
