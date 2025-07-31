# 📧 Configurazione EmailJS per Email Reali

## 🚀 Setup Completo

### 1. **Registrazione EmailJS**
1. Vai su [https://www.emailjs.com/](https://www.emailjs.com/)
2. Crea un account gratuito
3. Verifica la tua email

### 2. **Configurazione Servizio Email**
1. Nel dashboard EmailJS, vai su **"Email Services"**
2. Clicca **"Add New Service"**
3. Scegli il tuo provider email:
   - **Gmail** (raccomandato)
   - **Outlook/Hotmail**
   - **Yahoo**
   - Altri provider
4. Collega il tuo account email
5. Copia il **Service ID** (es: `service_xxxxxx`)

### 3. **Creazione Template Email**

#### Template 1: Bonifico Bancario
1. Vai su **"Email Templates"**
2. Clicca **"Create New Template"**
3. **Template ID**: `bank_transfer_template`
4. **Template Content**:

```html
Oggetto: 🏦 Istruzioni Bonifico - Prenotazione AUROOMS {{booking_reference}}

Gentile {{customer_name}},

La ringraziamo per aver scelto AUROOMS Guest House!

📋 RIEPILOGO PRENOTAZIONE:
• Camera: {{room_name}}
• Check-in: {{checkin_date}}
• Check-out: {{checkout_date}}
• Ospiti: {{guests}}
• Notti: {{nights}}
• Prezzo per notte: €{{price_per_night}}
• TOTALE: €{{total_amount}}

🏦 COORDINATE BANCARIE:
• IBAN: {{iban}}
• BIC/SWIFT: {{bic}}
• Intestatario: {{account_holder}}
• Causale: Prenotazione {{room_name}} - {{booking_reference}}
• Importo: €{{total_amount}}

⚠️ IMPORTANTE:
- Effettuare il bonifico entro 24 ore
- Inviare ricevuta a: info@aurooms.com
- La prenotazione sarà confermata al ricevimento del pagamento

📞 Per assistenza: +39 375 884 3175
📧 Email: info@aurooms.com

Cordiali saluti,
Team AUROOMS
```

#### Template 2: Conferma Pagamento
1. Crea un secondo template
2. **Template ID**: `payment_confirmation_template`
3. **Template Content**:

```html
Oggetto: ✅ Pagamento Confermato - AUROOMS {{booking_reference}}

Gentile {{customer_name}},

Il suo pagamento è stato confermato con successo!

📋 DETTAGLI PRENOTAZIONE:
• Camera: {{room_name}}
• Check-in: {{checkin_date}}
• Check-out: {{checkout_date}}
• Ospiti: {{guests}}
• Totale pagato: €{{total_amount}}
• Metodo pagamento: {{payment_method}}
• Riferimento: {{booking_reference}}

🎉 La sua prenotazione è CONFERMATA!

📍 AUROOMS Guest House
Via Example 123, Cinisi (PA)
A soli 3km dall'Aeroporto di Palermo

📞 Contatti:
• Telefono: +39 375 884 3175
• WhatsApp: +39 375 884 3175
• Email: info@aurooms.com

La aspettiamo per un soggiorno indimenticabile!

Team AUROOMS
```

### 4. **Configurazione nel Codice**

Modifica questi valori nel file `pagamento.html`:

```javascript
// Sostituisci con i tuoi dati reali:
emailjs.init("YOUR_PUBLIC_KEY");        // La tua Public Key
'YOUR_SERVICE_ID'                       // Il tuo Service ID
'YOUR_TEMPLATE_ID'                      // bank_transfer_template
'YOUR_CONFIRMATION_TEMPLATE_ID'         // payment_confirmation_template
```

### 5. **Trovare le Chiavi**

#### Public Key:
1. Dashboard EmailJS → **"Account"**
2. Copia **"Public Key"**

#### Service ID:
1. Dashboard EmailJS → **"Email Services"**
2. Copia l'ID del servizio creato

#### Template ID:
1. Dashboard EmailJS → **"Email Templates"**
2. Copia l'ID di ogni template

### 6. **Test Email**

Per testare:
1. Sostituisci le chiavi nel codice
2. Apri `pagamento.html`
3. Seleziona "Bonifico Bancario"
4. Clicca su "Conferma Bonifico"
5. Controlla la tua email!

### 7. **Limiti Piano Gratuito**
- ✅ **200 email/mese** gratuite
- ✅ Tutti i provider email
- ✅ Templates illimitati
- ✅ Nessun setup server

### 8. **Esempio Configurazione Completa**

```javascript
// Inizializza EmailJS
(function(){
  emailjs.init("user_abcd1234efgh5678"); // La tua Public Key
})();

// Nei template ID
emailjs.send('service_gmail123', 'bank_transfer_template', templateParams)
emailjs.send('service_gmail123', 'payment_confirmation_template', templateParams)
```

### 🎯 **Risultato Finale**
- ✅ Email reali inviate automaticamente
- ✅ Coordinate bancarie via email
- ✅ Conferme pagamento automatiche
- ✅ Templates professionali
- ✅ Nessun server necessario

🚀 **In 10 minuti avrai email reali funzionanti!**
