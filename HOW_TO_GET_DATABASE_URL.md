# 🎯 GUIDA VISUALE: Come Trovare DATABASE_URL in Supabase

## PERCORSO ESATTO:
Dashboard Supabase → Settings (⚙️) → Database → Scroll giù → "Connection parameters"

## COSA CERCARE:

### Sezione "Connection parameters" o "Connection info"
Troverai questi campi:

```
Host: [qualcosa come] db.xxxxxxxxx.supabase.co
Database name: postgres
Port: 5432
User: postgres
Password: [la tua password]
```

### Sezione "Connection pooling" (QUESTA È QUELLA GIUSTA PER NETLIFY!)
Troverai:

```
Host: [qualcosa come] aws-0-eu-central-1.pooler.supabase.com  
Database name: postgres
Port: 6543  
User: postgres.xxxxxxxxxxxxxxxxx
Password: [la tua password]
```

## ⚠️ IMPORTANTE: USA LA SEZIONE "CONNECTION POOLING"!

### Formato finale per Netlify:
```
postgresql://postgres.xxxxxxxxxxxxxxxxx:[TUA_PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
```

## 🔍 SE NON TROVI LA SEZIONE:

1. Assicurati di essere in Settings → Database
2. Scroll verso il basso (potrebbero essere sotto altre info)
3. Cerca una sezione chiamata "Connection pooling" o "Pooler configuration"
4. Se non c'è, usa i parametri normali ma cambia la porta da 5432 a 6543

## 📋 CHECKLIST RAPIDA:
- [ ] Sei in Settings → Database
- [ ] Hai trovato Host (tipo: aws-0-eu-central-1.pooler.supabase.com)
- [ ] Hai trovato User (tipo: postgres.xxxxxxxxxxxxxxxxx)  
- [ ] Hai la Password che hai creato
- [ ] Port è 6543 (per connection pooling)
- [ ] Database name è "postgres"
