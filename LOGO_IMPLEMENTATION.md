# Logo AUROOMS - Guida di Implementazione

## 📋 Panoramica
Il logo AUROOMS è stato integrato in tutte le pagine del sito e nei template email automatici.

## 🌐 Implementazione nelle Pagine Web

### Logo nella Navigation
Il logo è stato aggiunto in tutte le pagine principali:
- `index.html`
- `pagamento.html`
- `checkout.html`
- `conferma.html`
- `conferma-finale.html`
- `dashboard.html`
- `login.html`
- `admin-dashboard.html`
- `admin-login.html`
- `admin-bonifici.html`

### Caratteristiche del Logo:
- **Altezza**: 35-40px (responsive)
- **Formato**: JPG
- **Posizione**: Alto a sinistra nella navigation
- **Funzionalità**: Cliccabile per tornare alla home
- **Styling**: Border-radius 4px

### Codice HTML Utilizzato:
```html
<a href="index.html" style="text-decoration: none; color: inherit; display: flex; align-items: center; gap: 0.5rem;">
  <img src="./attached_assets/logo_aurooms.jpg" alt="AUROOMS Logo" style="height: 35px; width: auto; border-radius: 4px;">
  <strong>AUROOMS</strong>
</a>
```

## 📧 Implementazione nelle Email

### Template EmailJS Aggiornati
Il logo è stato integrato nei seguenti template:
- `bank_transfer_template` (Email bonifico)
- `payment_confirmation` (Conferma pagamento)
- `template_admin_copy` (Copia admin)

### Parametri Aggiunti ai Template:
- `logo_url`: URL completo del logo
- `company_name`: Nome dell'azienda

### Codice JavaScript per Email:
```javascript
{
  // ... altri parametri ...
  logo_url: window.location.origin + '/attached_assets/logo_aurooms.jpg',
  company_name: 'AUROOMS Guest House'
}
```

## 🔧 Configurazione EmailJS

### Per utilizzare il logo nelle email, aggiungi nel template EmailJS:

#### Template HTML Migliorato per Conferma Pagamento:
```html
<div style="font-family: system-ui, sans-serif, Arial; font-size: 14px; color: #333; padding: 14px 8px; background-color: #f5f5f5;">
  
  <div style="max-width: 600px; margin: auto; background-color: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    
    <!-- LOGO HEADER -->
    <div style="text-align: center; padding: 25px 20px; background: linear-gradient(135deg, #007bff 0%, #0056b3 100%); border-top: 6px solid #458500;">
      <img src="{{logo_url}}" alt="{{company_name}}" style="max-height: 70px; width: auto; margin-bottom: 10px; border-radius: 6px;" />
      <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: bold;">{{company_name}}</h1>
      <p style="color: #e3f2fd; margin: 5px 0 0 0; font-size: 14px; font-style: italic;">La vostra casa lontano da casa</p>
    </div>

    <!-- CONTENT -->
    <div style="padding: 25px;">
      
      <!-- SUCCESS MESSAGE -->
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color: #28a745; text-align: center; margin: 0 0 20px 0;">✅ Pagamento Confermato!</h2>
      </div>
      
      <p style="margin-bottom: 15px;">Gentile {{customer_name}},</p>
      
      <p style="margin-bottom: 20px;">Il suo pagamento è stato <strong style="color: #28a745;">confermato con successo</strong>!</p>
      
      <!-- CONFIRMATION BOX -->
      <div style="background-color: #d4edda; padding: 20px; border-radius: 8px; border-left: 4px solid #28a745; margin: 20px 0;">
        <h3 style="color: #155724; margin-top: 0; margin-bottom: 10px;">🎉 La sua prenotazione è CONFERMATA!</h3>
        <p style="margin-bottom: 0; color: #155724;">Può considerare la sua camera riservata. La aspettiamo!</p>
      </div>
      
      <!-- BOOKING DETAILS -->
      <h3 style="color: #007bff; margin: 25px 0 15px 0;">📋 DETTAGLI PRENOTAZIONE:</h3>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr style="background-color: #f8f9fa;">
          <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;">Camera:</td>
          <td style="padding: 12px; border: 1px solid #dee2e6;">{{room_name}}</td>
        </tr>
        <tr>
          <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;">Check-in:</td>
          <td style="padding: 12px; border: 1px solid #dee2e6;">{{checkin_date}}</td>
        </tr>
        <tr style="background-color: #f8f9fa;">
          <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;">Check-out:</td>
          <td style="padding: 12px; border: 1px solid #dee2e6;">{{checkout_date}}</td>
        </tr>
        <tr>
          <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;">Ospiti:</td>
          <td style="padding: 12px; border: 1px solid #dee2e6;">{{guests}}</td>
        </tr>
        <tr style="background-color: #f8f9fa;">
          <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;">Totale pagato:</td>
          <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold; color: #28a745; font-size: 16px;">€{{total_amount}}</td>
        </tr>
        <tr>
          <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;">Metodo pagamento:</td>
          <td style="padding: 12px; border: 1px solid #dee2e6;">{{payment_method}}</td>
        </tr>
        <tr style="background-color: #f8f9fa;">
          <td style="padding: 12px; border: 1px solid #dee2e6; font-weight: bold;">Riferimento:</td>
          <td style="padding: 12px; border: 1px solid #dee2e6; font-family: monospace;">{{booking_reference}}</td>
        </tr>
      </table>
      
      <!-- LOCATION INFO -->
      <div style="background-color: #e3f2fd; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #007bff;">
        <h3 style="color: #0d47a1; margin-top: 0; margin-bottom: 15px;">📍 AUROOMS Guest House</h3>
        <p style="margin: 8px 0; color: #1565c0;">🌟 A soli 3km dall'Aeroporto di Palermo</p>
        <p style="margin: 8px 0; color: #1565c0;">🚗 Transfer disponibile su richiesta</p>
        <p style="margin-bottom: 0; color: #1565c0;">🏖️ Vicino alle più belle spiagge della Sicilia</p>
      </div>
      
      <hr style="border: 1px solid #dee2e6; margin: 30px 0;">
      
      <!-- CONTACTS -->
      <h3 style="color: #007bff; margin-bottom: 15px;">📞 I nostri contatti:</h3>
      <div style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; margin: 15px 0;">
        <table style="width: 100%;">
          <tr>
            <td style="padding: 6px 0; width: 30%;"><strong>📱 Telefono:</strong></td>
            <td style="padding: 6px 0;">+39 375 884 3175</td>
          </tr>
          <tr>
            <td style="padding: 6px 0;"><strong>💬 WhatsApp:</strong></td>
            <td style="padding: 6px 0;">+39 375 884 3175</td>
          </tr>
        </table>
      </div>
      
      <!-- THANK YOU MESSAGE -->
      <div style="text-align: center; margin: 30px 0; padding: 25px; background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%); border-radius: 8px; border: 1px solid #ffc107;">
        <h4 style="color: #856404; margin-top: 0; margin-bottom: 10px; font-size: 18px;">✨ La aspettiamo per un soggiorno indimenticabile! ✨</h4>
        <p style="margin-bottom: 0; color: #856404; font-style: italic;">Grazie per aver scelto AUROOMS Guest House</p>
      </div>
      
      <!-- SIGNATURE -->
      <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6;">
        <p style="margin: 0;">
          <strong style="color: #007bff; font-size: 16px;">Team AUROOMS</strong><br>
          <em style="color: #6c757d; font-size: 14px; margin-top: 5px; display: inline-block;">"La vostra casa lontano da casa"</em>
        </p>
      </div>
      
    </div>
  </div>
  
  <!-- FOOTER -->
  <div style="max-width: 600px; margin: auto; padding-top: 15px;">
    <p style="color: #999; text-align: center; font-size: 12px; line-height: 1.4;">
      Questa è una mail automatica.<br>
      La preghiamo di contattarci telefonicamente per qualsiasi dubbio.
    </p>
  </div>
  
</div>
```

#### Template Text (fallback):
```
{{company_name}} - La vostra casa lontano da casa
{{logo_url}}
```

## 📁 File Modificati

### File HTML Aggiornati:
1. `index.html` - Logo nella navigation principale
2. `pagamento.html` - Logo + integrazione email
3. `admin-dashboard.html` - Logo sidebar + email templates
4. `admin-login.html` - Logo nella pagina di login
5. `admin-bonifici.html` - Logo + email templates
6. `checkout.html` - Logo nella navigation
7. `conferma.html` - Logo nella navigation
8. `conferma-finale.html` - Logo nella navigation
9. `dashboard.html` - Logo nella navigation
10. `login.html` - Logo nella navigation

### File JavaScript Aggiornati:
- Template EmailJS in tutti i file con funzionalità email

## 🎨 Personalizzazione

### Per cambiare il logo:
1. Sostituisci il file `./attached_assets/logo_aurooms.jpg`
2. Mantieni il nome del file per compatibilità automatica
3. Oppure aggiorna tutti i riferimenti al logo nelle pagine

### Per cambiare le dimensioni:
Modifica il CSS `height` in tutti i file da 35px al valore desiderato.

## ✅ Test Consigliati

1. **Navigation**: Verifica che il logo appaia in tutte le pagine
2. **Link**: Testa che cliccando il logo si torni alla home
3. **Email**: Invia un'email di test per verificare la visualizzazione del logo
4. **Responsive**: Controlla su dispositivi mobili

## 🔗 URL del Logo per Test

- Locale: `http://localhost/attached_assets/logo_aurooms.jpg`
- Production: `https://tuodominio.com/attached_assets/logo_aurooms.jpg`

## 📞 Supporto

Per problemi o modifiche al logo, controlla:
1. Che il file `logo_aurooms.jpg` esista nella cartella `attached_assets`
2. Che i percorsi siano corretti in tutti i file
3. Che EmailJS abbia i nuovi parametri configurati nei template
