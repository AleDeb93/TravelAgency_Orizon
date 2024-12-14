# Progetto FullStack: Angular & Node.js

## Struttura delle Cartelle

### `/client`
Contiene tutto ciò che riguarda l'applicazione **Angular**. All'interno della cartella `src` ci sono i componenti, i servizi e le altre risorse necessarie per il funzionamento del frontend.

### `/server`
Contiene l'applicazione **Node.js** con **Express**. 
- `controllers`: gestisce le richieste HTTP.
- `routes`: definisce le rotte dell'API.
- `models`: gestisce i modelli dati.

Questo aiuta a mantenere una chiara separazione delle responsabilità nel backend.

### `/shared`
Questa cartella contiene il codice che può essere condiviso tra il frontend e il backend. Ad esempio:
- Tipi TypeScript.
- Interfacce.
- Modelli di dati.

L'obiettivo è mantenere coerenza e riusabilità tra le due parti dell'applicazione.

### `/docs`
Qui sono inseriti i documenti di progetto quali;
- Guide all'installazione e configurazione.
- Descrizione del flusso di lavoro.

### `.gitignore`
Per indicare a Git quali file o cartelle non devono essere incluse nel repository, come:
- `node_modules`: le dipendenze del progetto.
- File di configurazione specifici del sistema.