document.addEventListener("DOMContentLoaded",function(){

    const settingsModal = document.getElementById('SettingsOverlay');
    const openSettingsBtn = document.querySelector('.Settings'); 
    const closeSettingsBtn = document.getElementById('Btn-Close');
    const saveSettingsBtn = document.getElementById('Btn-Salva');
    const exportBtn = document.getElementById('Export-Btn');
    const resetBtn = document.getElementById('ResetSystem-Btn');
    const movimenti = JSON.parse(localStorage.getItem('movimenti')) || [];
    const displayTotale = document.querySelector('.Totale');
    const displayUltimiMovimenti = document.querySelector('.Movimenti');

    const getDati = () => JSON.parse(localStorage.getItem('movimenti')) || [];

    const totale = movimenti.reduce((acc, m) => {
        return m.tipo === 'Entrata' ? acc + m.importo : acc - m.importo;
    }, 0);
    displayTotale.textContent = `${totale.toFixed(2)}€`;

    const ultimiTre = movimenti.slice(-3).reverse();
    const container = document.querySelector('.Movimenti');
    container.innerHTML = '<h1> Ultimi 3 Movimenti: </h1>';

    ultimiTre.forEach(m => {
        const p = document.createElement('p');
        p.className = 'InOut';
        const segno = m.tipo === 'Entrata' ? '+' : '-';
        const colore = m.tipo === 'Entrata' ? '#2ecc71' : '#e74c3c';
        p.innerHTML = `<span style="color: ${colore}">${segno} ${m.importo.toFixed(2)}€</span> <small style="font-size:12px; opacity:0.6">(${m.dettagli || '...' })</small>`;
        container.appendChild(p);
    });

    if (openSettingsBtn) {
        openSettingsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            settingsModal.style.display = 'flex';
        });
    }

    if (closeSettingsBtn) {
        closeSettingsBtn.addEventListener('click', () => {
            settingsModal.style.display = 'none';
        });
    }

    if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener('click', () => {
            const settings = {
                currency: document.getElementById('Currency').value,
                savings: document.getElementById('GoalSavings').value,
                spending: document.getElementById('GoalSpending').value 
            };

            localStorage.setItem('userSettings', JSON.stringify(settings));
            alert("Impostazioni salvate!");
            settingsModal.style.display = 'none';
        });
    }

    exportBtn?.addEventListener('click', () => {
        
        const dati = getDati();
        if (dati.length === 0) {
            alert("Non ci sono dati da esportare.");
            return;
        }

        const datiPerExcel = dati.map(m => ({
            "Data": m.data,
            "Descrizione": m.dettagli || "Nessun Dettaglio",
            "Tipo": m.tipo,
            "Metodo di Pagamento": m.pagamento || "N/D",
            "Importo (€)": parseFloat(m.importo).toFixed(2)
        }));

        const worksheet = XLSX.utils.json_to_sheet(datiPerExcel);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Movimenti");

        XLSX.writeFile(workbook, `Report_Contabile_${new Date().getFullYear()}.xlsx`);
    });

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (confirm("Sei sicuro? Questo cancellerà tutti i dati.")) {
                localStorage.clear();
                location.reload();
            }
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
            settingsModal.style.display = 'none';
        }
    });
});