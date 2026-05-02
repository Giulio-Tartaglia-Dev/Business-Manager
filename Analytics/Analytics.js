document.addEventListener("DOMContentLoaded", () => {
    const movimenti = JSON.parse(localStorage.getItem('movimenti')) || [];
    const settings = JSON.parse(localStorage.getItem('userSettings')) || { spending: 0, savings: 0 };

    let totalEntrate = 0;
    let totalUscite = 0;

    movimenti.forEach(m => {
        if (m.tipo === 'Entrata') totalEntrate += m.importo;
        else totalUscite += m.importo;
    });

    const saldoAttuale = totalEntrate - totalUscite;

    const ctxRatio = document.getElementById('ratioChart').getContext('2d');
    new Chart(ctxRatio, {
        type: 'doughnut',
        data: {
            labels: ['Entrate', 'Uscite'],
            datasets: [{
                data: [totalEntrate, totalUscite],
                backgroundColor: ['#2ecc71', '#e74c3c'],
                borderWidth: 0
            }]
        },

        options: { 
            responsive: true, maintainAspectRatio: false 
        }
    });

    const limiteSpesa = parseFloat(settings.spending) || 0;
    const ctxBudget = document.getElementById('budgetChart').getContext('2d');
    new Chart(ctxBudget, {
        type: 'bar',
        data: {
            labels: ['Budget Mensile'],
            datasets: [
                {
                    label: 'Limite Impostato',
                    data: [limiteSpesa],
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                },
                {
                    label: 'Spesa Effettiva',
                    data: [totalUscite],
                    backgroundColor: totalUscite > limiteSpesa ? '#e74c3c' : '#3498db'
                }
            ]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            scales: { x: { beginAtZero: true } }
        }
    });

    const targetRisparmio = parseFloat(settings.savings) || 0;
    const ctxSavings = document.getElementById('savingsChart').getContext('2d');
    new Chart(ctxSavings, {
        type: 'line',
        data: {
            labels: ['Inizio', 'Attuale', 'Obiettivo'],
            datasets: [{
                label: 'Risparmi',
                data: [0, saldoAttuale, targetRisparmio],
                borderColor: '#2ecc71',
                fill: true,
                backgroundColor: 'rgba(46, 204, 113, 0.1)',
                tension: 0.4
            }]
        }
    });

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