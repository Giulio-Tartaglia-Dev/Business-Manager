document.addEventListener("DOMContentLoaded", () => {
    const savedMovements = JSON.parse(localStorage.getItem('movimenti')) || [];
    const listaMovimenti = document.getElementById('ListaMovimenti');
    const modal = document.getElementById('Overlay');
    const openBtn = document.querySelector('.Btn-Add');
    const closeBtn = document.getElementById('Close-Btn');
    const saveBtn = document.getElementById('Save-Btn');

    function renderMovimento(movimento) {
        const nuovoMovimento = document.createElement('div');
        nuovoMovimento.className = 'SingoloMovimento';
        const coloreClasse = movimento.tipo === 'Entrata' ? 'TestoVerde' : 'TestoRosso';
        const segno = movimento.tipo === 'Entrata' ? '+' : '-';

        nuovoMovimento.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                <div style="flex: 1;">
                    <span class="DataMovimento" style="font-size: 10px; opacity: 0.5; display: block;">${movimento.data}</span>
                    <span style="font-size: 9px; background: #eee; padding: 1px 5px; border-radius: 4px; text-transform: uppercase; font-weight: bold; color: #666;">${movimento.pagamento || 'N/D'}</span>
                    <span class="DettaglioTesto">${movimento.dettagli || 'Nessun Dettaglio'}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 20px;">
                    <span class="${coloreClasse}" style="font-weight: bold;">
                        ${segno} ${parseFloat(movimento.importo).toFixed(2)}€
                    </span>
                    <button class="Btn-Delete">✕</button>
                </div>
            </div>`;

        nuovoMovimento.querySelector('.Btn-Delete').addEventListener('click', () => {
            nuovoMovimento.style.transform = "translateX(100px)";
            nuovoMovimento.style.opacity = "0";
            nuovoMovimento.style.transition = "all 0.3s ease";
            
            setTimeout(() => {
                const index = savedMovements.indexOf(movimento);
                if (index > -1) {
                    savedMovements.splice(index, 1);
                    localStorage.setItem('movimenti', JSON.stringify(savedMovements));
                }
                nuovoMovimento.remove();
            }, 300);
        });

        listaMovimenti.prepend(nuovoMovimento);
    }

    savedMovements.forEach(m => renderMovimento(m));

    openBtn.addEventListener('click', () => modal.style.display = 'flex');
    closeBtn.addEventListener('click', () => modal.style.display = 'none');

    saveBtn.addEventListener('click', () => {
        const importo = document.getElementById('amount').value;
        const tipo = document.getElementById('type').value;
        const payment = document.getElementById('PayMethod').value;
        const dettagli = document.getElementById('details').value;

        if (importo === "" || importo <= 0) {
            alert("Inserisci un importo valido!");
            return;
        }

        const ora = new Date();
        const nuovoM = {
            id: Date.now(), 
            importo: parseFloat(importo),
            tipo: tipo,
            pagamento: payment,
            dettagli: dettagli,
            data: `${ora.getDate()}/${ora.getMonth() + 1}/${ora.getFullYear()}`
        };

        savedMovements.push(nuovoM);
        localStorage.setItem('movimenti', JSON.stringify(savedMovements));

        renderMovimento(nuovoM);

        modal.style.display = 'none';
        document.getElementById('amount').value = "";
        document.getElementById('details').value = "";
    });

    const filterInput = document.getElementById('FilterInput');
    filterInput.addEventListener('keyup', () => {
        const valoreRicerca = filterInput.value.toLowerCase();
        const tuttiIMovimenti = document.querySelectorAll('.SingoloMovimento');

        tuttiIMovimenti.forEach(movimento => {
            const descrizione = movimento.querySelector('.DettaglioTesto').textContent.toLowerCase();
            const data = movimento.querySelector('.DataMovimento').textContent.toLowerCase();

            if (descrizione.includes(valoreRicerca) || data.includes(valoreRicerca)) {
                movimento.style.display = "block";
            } else {
                movimento.style.display = "none";
            }
        });
    });

    // 5. Gestione Impostazioni e Reset
    const settingsModal = document.getElementById('SettingsOverlay');
    const openSettingsBtn = document.querySelector('.Settings');
    const closeSettingsBtn = document.getElementById('Btn-Close');
    const saveSettingsBtn = document.getElementById('Btn-Salva');
    const exportBtn = document.getElementById('Export-Btn');
    const resetBtn = document.getElementById('ResetSystem-Btn');

    const getDati = () => JSON.parse(localStorage.getItem('movimenti')) || [];

    openSettingsBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        settingsModal.style.display = 'flex';
    });

    closeSettingsBtn?.addEventListener('click', () => settingsModal.style.display = 'none');

    saveSettingsBtn?.addEventListener('click', () => {
        const settings = {
            currency: document.getElementById('Currency').value,
            savings: document.getElementById('GoalSavings').value,
            spending: document.getElementById('GoalSpending').value
        };
        localStorage.setItem('userSettings', JSON.stringify(settings));
        alert("Impostazioni salvate!");
        settingsModal.style.display = 'none';
    });

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

    resetBtn?.addEventListener('click', () => {
        if (confirm("Sei sicuro? Questo cancellerà tutti i dati in modo permanente.")) {
            localStorage.clear();
            location.reload();
        }
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
        if (e.target === settingsModal) settingsModal.style.display = 'none';
    });
});