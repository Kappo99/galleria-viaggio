# 📸 Galleria di Viaggio – Esercizio Tecnico

Questo repository contiene il codice sorgente per una web app di tipo "galleria fotografica personale", sviluppata come esercizio tecnico.

## 🎯 Obiettivo dell'app

Realizzare una web app chiamata **"Galleria di viaggio"** in cui un utente può caricare e visualizzare le proprie foto di viaggio con alcune informazioni aggiuntive.  
L’obiettivo è simulare un’app personale dove un utente può documentare i propri ricordi fotografici e rivederli nel tempo.

L'app deve essere sviluppata utilizzando **Next.js**.

---

## ✅ Requisiti minimi

- Form per caricare un’immagine, con i seguenti campi:
  - Titolo
  - Tag testuale
  - Note descrittive
  - (Facoltativi) Altri campi ritenuti utili

- Le immagini caricate devono essere visibili in una griglia
- Utilizzo di un database relazionale con ORM a scelta
- Si consiglia l'utilizzo di **Supabase** come backend-as-a-service per:
  - Database
  - Storage
  - Autenticazione (opzionale)

---

## 📦 Output richiesto

- Repository Git contenente il codice completo
- Deploy online (es. su Vercel) se possibile
- In alternativa, istruzioni dettagliate per avviare in locale

---

## ✨ Nice to have (opzionali ma apprezzati)

- Autenticazione tramite Supabase
- Campo Tag con selezione multipla
- Supporto al caricamento multiplo delle immagini nello stesso form

---

## 🛠 Stack consigliato

- **Frontend:** [Next.js](https://nextjs.org/)
- **Backend-as-a-Service:** [Supabase](https://supabase.com/)
- **Stilizzazione:** Tailwind CSS o altra UI library a scelta
- **ORM (se non si usa Supabase direttamente):** Prisma, Drizzle, ecc.

---

## 🚀 Come iniziare

```bash
git clone https://github.com/Kappo99/galleria-viaggio.git
cd galleria-viaggio
npm install
cp .env.local.example .env.local  # Inserisci le credenziali Supabase
npm run dev
```

---

## 📝 Licenza

Questo progetto è destinato esclusivamente a scopo di valutazione tecnica.
