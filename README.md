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

## 📝 Licenza

Questo progetto è destinato esclusivamente a scopo di valutazione tecnica.

---

## 🖥️ Utilizzo
Il progetto è stato pubblicato su Vercel, disponibile al seguente link:
https://galleria-viaggio.vercel.app/

---

## 📒 Spiegazioni tecniche (e scelte progettuali)
Di seguito vengono spiegate alcune scelte progettuali attuate, e alcune spiegazioni relative al codice scritto.

### Versione base
Inizialmente ho sviluppato il progetto in modo che potesse accettare il caricamento di 1 sola immagine.
Per fare ciò era sufficiente una tabella `photos` nel Database, con i campi utili (titolo, note, URL, tags).
Il campo tags è un array di text, che viene salvato utilizzando la "," come carattere separatore.

### Versione avanzata
Nella traccia veniva richiesto come opzione aggiuntiva la possibilità di inserire più immagini contemporaneamente, sfruttando il campo input multiplo.
Impostare solo l'attributo `multiple` sull'input e ciclando su tutti i file caricati non era sufficiente per una soluzione ottimale, in quanto nel Database venivano inseriti più record con lo stesso titolo, note e tag, che differivano solo per l'URL dell'immagine. Inoltre, nella griglia di foto si vedevano 2 o più foto differenti, ma con gli stessi dati.
Per questo motivo ho deciso di gestire ogni caricamento come se fosse un post, al quale possono essere associate più foto (per semplicità ho scelto di mostrare le foto con un'anteprima piccola a griglia, anziché creare un carosello di immagini).

Al fine di gestire correttamente i post e le relative foto ho dovuto modificare il database, creando 2 tabelle:
- `posts`: id, user_id, title, notes, tags, created_at
- `photos`: id, post_id, image_url, created_at

Una volta fatto ciò, nel frontend Next.js avevo 2 opzioni differenti per reperire tutti i dati dei post e delle photos:
a. scrivere 2 Query JS differenti per reperire sia i post sia le photos, poi unire i dati tramite frontend js (soluzione semplice, ma poco robusta)
b. creare una view tramite SQL con un filtro sull'auth.uuid, in modo che vengano mostrati solo i dati dell'utente che ha effettuato il login (soluzione più complessa, ma robusta)
Io ho optato per la seconda opzione, quella della view SQL.

### Supabase
Utilizzando Supabase ho scelto di implementare sia l'autenticazione standard tramite email e password, sia l'accesso tramite account Google. Questo permette di avere più flessibilità e dare più scelta agli utenti.

Per quanto riguarda il salvataggio delle immagini, ho creato un bucket storage `photos`. Per garantire la sicurezza delle informazionilo ho impostato come privato, quindi le immagini non soino accessibili puiibblicamente tramite URL.
A tal proposito, per mostrare correttamente le immagini all'interno della Web App non potevo utilizzare direttamente il public_url, ma ogni volta viene generato un signed_url (tramite l'autenticazione utente) valido per 1 ora.

Per garantire la sicurezza, Supabase utilizza le RLS Policy, le quali sono attive di default, ma necessitano di una configurazione manuale.
Per far funzionare correttamente la Web App ho creato diverse RLS Policy (sia sulle tabelle del Database sia sul bucket storage) relative alle operazioni di SELECT, INSERT e DELETE (per semplicità non ho implementato alcuna funzionalità di UPDATE). In pratica ogni utente autenticato può visualizzare o eliminare solo i propri post e le proprie foto.

### TypeScript e sessione utente
Avendo utilizzato Next.js con TypeScript, si ha un controllo sui tipi dei dati. Per questo motivo ho creato una cartella `types` che contiene i 2 tipi di dati custom (`Post` e `Photo`). In questo modo quando eseguo operazioni di SELECT o INSERT tramite js, ho un controllo sui dati utilizzati, e la garanzia che non ricevo oggetti sconosciuti.

Per quanto riguarda la sessione utente, ho previsto una pagina di login/registrazione che permette di fare l'accesso tramite email e password, oppure tramite Google.
Per garantire che le varie pagine della Web App siano accessibili solo dopo aver effettuato il login, ho creato un componente `AuthGuard` che funge da container per tutte le pagine esistenti. All'interno di questo componente verifico che ci sia una sessione di supabase attiva (a meno che mi trovo nella pagina di login), e in caso negativo forzo il redirect alla pagina di login/registrazione.
