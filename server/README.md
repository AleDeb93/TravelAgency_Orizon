# Progetto lato Server

Il server contiene l'applicazione **Node.js** con **Express**. La logica del backend viene divisa in diverse cartelle:
- `controllers`: gestisce le richieste HTTP.
- `routes`: definisce le rotte dell'API.
- `models`: gestisce i modelli dati.

Questo aiuta a mantenere una chiara separazione delle responsabilità nel backend.

### `.gitignore`
Per indicare a Git quali file o cartelle non devono essere incluse nel repository, come:
- `node_modules`: le dipendenze del progetto.
- File di configurazione specifici del sistema.

## Librerie installate e utilizzate

Per il progetto sono state installate diverse librerie con funzionalita utili allo scopo finale
- `Express`: Framework minimalista per creare il server e gestire le rotte HTTP.
- `bcrypt`: per hashare le psw prima di salvarle a database 
- `Sequelize`: ORM per interagire con il database MySQL, gestire la sincronizzazione e l'accesso ai dati.
- `nodemon`: Strumento per monitorare i cambiamenti nel codice e riavviare automaticamente il server durante lo sviluppo.

## Avvio del progetto lato backend
Per iniziare ad utilizzare il progetto lato backend assicurati di avere [Node.js](https://nodejs.org/en/download) installato sulla tua macchina.

Dopo aver clonato il repository, apri un terminale nella cartella del progetto ed esegui il comando: `npm install`

Questo comando installerà tutte le dipendenze necessarie per il progetto.

### Installazione e configurazione MySQL

Prima di avviare il server, assicurati di avere MySQL installato e in esecuzione sulla tua macchina. Puoi scaricarlo dal sito ufficiale di [MySQL](https://dev.mysql.com/downloads/mysql/) e accedere con il tuo account Oracle, crearne uno o scaricarlo senza effettuare l'accesso. Senza questo prerequisito, non sarà possibile utilizzare correttamente l'applicazione.

Segui l'installazione guidata di MySQL e verifica che sia andato tutto a buon fine utilizzando il comando: `mysql --version` 

Se il comando non funziona, potresti dover modificare la variabile d'ambiente **path** per includere il percorso MySQL corretto (ad esempio: *C:\Program Files\MySQL\MySQL Server x.x\bin*). Dopo aver aggiornato la variabile d'ambiente, riavvia il terminale.

### Creazione del Database

Accedi a MySQL con il comando: `mysql -u root -p`

Inserisci la password che hai scelto durante l'installazione per l'utente **root**. Quindi, crea il database: `CREATE DATABASE travel_agency;`

### Configurazione del Database

Crea il file `config/database.js` per configurare correttamente le credenziali del tuo database MySQL (ad esempio, nome utente, password, host, ecc.). Questo passaggio ti permetterà di non interagire direttamente con il database, ma di utilizzare il progetto per creare le tabelle e aggiornare i record in esso contenuti, se necessario.

### Avvio del server

Una volta completata la configurazione, puoi avviare il server. Apri un terminale nella cartella di progetto e usa il comando: `nodemn index.js`

Questo comando avvierà il server utilizzando **nodemon**, monitorando i cambiamenti nel codice e riavviando automaticamente il server durante lo sviluppo.
In alternativa puoi usare il comando `node index.js` questo avvierà una versione "*statica*" del server che non verrà riavviato ad ogni modifica del sorgente.

Il server sarà quindi accessibile su http://localhost:3000.
