# 💻 Business Manager - Financial Dashboard UI

Un'interfaccia web moderna e reattiva progettata per la gestione contabile personale e aziendale. Il progetto si focalizza sulla trasparenza dei flussi di cassa attraverso un'esperienza utente pulita, professionale e focalizzata sui dati.

## 🚀 Live Demo

Visualizza il progetto dal vivo: [Business Manager Demo](https://giulio-tartaglia-dev.github.io/Business-Manager/Home/Home.html)

## 🛠️ Caratteristiche Tecniche

*   **Architettura Modulare:** Il codice è organizzato in directory separate (`Home`, `Balance`, `Analytics`, `Ai`) per massimizzare la manutenibilità e la scalabilità del software.
*   **Modern UI/UX:** Utilizzo di CSS avanzato con effetti di trasparenza (`backdrop-filter`), gradienti radiali e animazioni sulle interazioni (`hover effects`) per garantire un'esperienza immersiva.
*   **Navigazione Dinamica:** Implementazione di una barra di navigazione laterale "sticky" con icone personalizzate e sistema di gestione stato per il monitoraggio in tempo reale del saldo.

## 🧰 Stack Tecnologico

*   **Frontend:** HTML5, CSS3 (Custom Properties & Flexbox), JavaScript ES6+.
*   **Design:** Montserrat Typography, Glassmorphism UI, Chart.js per la visualizzazione dati.
*   **Struttura:** Organizzazione multi-cartella per separazione degli asset (Icons, CSS specifici, script di logica).

## 📂 Struttura del Progetto
```text
.
├── Home/
│   ├── Home.html        # Landing page con overview saldo e movimenti
│   ├── Home.css         # Stili globali e keyframes animazioni
│   └── Home.js          # Logica di calcolo totale e gestione impostazioni
├── Balance/
│   ├── Balance.html     # Gestione transazioni e registro contabile
│   ├── Balance.css      # Layout specifico per liste e modali
│   └── Balance.js       # Motore di inserimento, filtro ed eliminazione dati
├── Analytics/
│   ├── Analytics.html   # Dashboard visuale con report grafici
│   ├── Analytics.css    # Stili per container grafici e card
│   └── Analytics.js     # Integrazione Chart.js e analisi budget
├── Ai/
│   ├── Ai.html          # Interfaccia assistente virtuale
│   └── Ai.css           # Styling per chat container e messaggi
└── Icons/               # Asset grafici e icone di sistema
