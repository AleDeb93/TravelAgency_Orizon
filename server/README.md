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
- `bcrypt`: per hashare le psw prima di salvarle a database 