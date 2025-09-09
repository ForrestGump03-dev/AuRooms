-- 🗄️ SCHEMA DATABASE AUROOMS
-- Copia e incolla nel SQL Editor di Supabase

-- Tabella Clienti
CREATE TABLE clienti (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cognome VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    data_nascita DATE,
    nazionalita VARCHAR(50),
    documento_tipo VARCHAR(20),
    documento_numero VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    gdpr_consent BOOLEAN DEFAULT FALSE
);

-- Tabella Prenotazioni
CREATE TABLE prenotazioni (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES clienti(id) ON DELETE CASCADE,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    numero_ospiti INTEGER NOT NULL DEFAULT 1,
    camera_tipo VARCHAR(50) DEFAULT 'standard',
    prezzo_totale DECIMAL(10,2),
    prezzo_per_notte DECIMAL(8,2),
    numero_notti INTEGER,
    stato VARCHAR(20) DEFAULT 'pending', -- pending, confirmed, cancelled, completed
    note_speciali TEXT,
    booking_reference VARCHAR(50) UNIQUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabella Pagamenti
CREATE TABLE pagamenti (
    id SERIAL PRIMARY KEY,
    prenotazione_id INTEGER REFERENCES prenotazioni(id) ON DELETE CASCADE,
    importo DECIMAL(10,2) NOT NULL,
    valuta VARCHAR(3) DEFAULT 'EUR',
    metodo_pagamento VARCHAR(50), -- stripe, bank_transfer, cash, etc.
    stripe_session_id VARCHAR(255),
    stripe_payment_intent_id VARCHAR(255),
    stato VARCHAR(20) DEFAULT 'pending', -- pending, completed, failed, refunded, cancelled
    data_pagamento TIMESTAMP,
    note TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabella Admin Sessions (opzionale)
CREATE TABLE admin_sessions (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(255) UNIQUE NOT NULL,
    user_email VARCHAR(255),
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tabella Configurazioni Sistema
CREATE TABLE configurazioni (
    id SERIAL PRIMARY KEY,
    chiave VARCHAR(100) UNIQUE NOT NULL,
    valore TEXT,
    descrizione TEXT,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Inserimento configurazioni di base
INSERT INTO configurazioni (chiave, valore, descrizione) VALUES 
('prezzo_per_notte', '80.00', 'Prezzo base per notte in EUR'),
('max_ospiti', '4', 'Numero massimo ospiti per prenotazione'),
('check_in_time', '15:00', 'Orario check-in standard'),
('check_out_time', '11:00', 'Orario check-out standard'),
('email_admin', 'info@aurooms.it', 'Email amministratore per notifiche'),
('telefono_struttura', '+39375884317', 'Telefono di contatto'),
('cancellation_hours', '24', 'Ore prima del check-in per cancellazione gratuita');

-- Indici per performance
CREATE INDEX idx_prenotazioni_date ON prenotazioni(check_in, check_out);
CREATE INDEX idx_prenotazioni_stato ON prenotazioni(stato);
CREATE INDEX idx_pagamenti_stato ON pagamenti(stato);
CREATE INDEX idx_clienti_email ON clienti(email);

-- Trigger per aggiornare updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_clienti_updated_at BEFORE UPDATE ON clienti FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_prenotazioni_updated_at BEFORE UPDATE ON prenotazioni FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pagamenti_updated_at BEFORE UPDATE ON pagamenti FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Commenti sulle tabelle
COMMENT ON TABLE clienti IS 'Informazioni clienti della guest house';
COMMENT ON TABLE prenotazioni IS 'Prenotazioni delle camere';
COMMENT ON TABLE pagamenti IS 'Tracking dei pagamenti associati alle prenotazioni';
COMMENT ON TABLE configurazioni IS 'Configurazioni sistema modificabili da admin';

-- Fine script
