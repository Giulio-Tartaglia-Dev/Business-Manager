import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyDIxP0OvJcxxMpHaBBo7n2_OT2FHx3XN5Y";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

document.addEventListener('DOMContentLoaded', () => {
    const chatBox = document.getElementById('ChatBox');
    const userInput = document.getElementById('UserInput');
    const sendBtn = document.getElementById('Send-Btn');

    const settingsModal = document.getElementById('SettingsOverlay');
    const openSettingsBtn = document.querySelector('.Settings');
    const closeSettingsBtn = document.getElementById('Btn-Close');
    const saveSettingsBtn = document.getElementById('Btn-Salva');
    const resetBtn = document.getElementById('ResetSystem-Btn');

    const getSystemContext = () => {
        const movimenti = JSON.parse(localStorage.getItem('movimenti')) || [];
        const settings = JSON.parse(localStorage.getItem('userSettings')) || {};
        return `
            DATI UTENTE ATTUALI:
            - Valuta: ${settings.currency || '€'}
            - Obiettivo Risparmio: ${settings.savings || 'Non impostato'}
            - Limite Spesa Mensile: ${settings.spending || 'Non impostato'}
            - Numero transazioni recenti: ${movimenti.length}
            - Ultimi movimenti (JSON): ${JSON.stringify(movimenti.slice(-5))}
        `;
    };

    const appendMessage = (text, type) => {
        const msgDiv = document.createElement('div');
        msgDiv.className = `Message ${type === 'user' ? 'UserMessage' : 'AiMessage'}`;

        if(type === 'ai') {
            msgDiv.innerHTML = marked.parse(text);
        }else{
            msgDiv.innerText = text;
        }
        chatBox.appendChild(msgDiv);
        chatBox.scrollTop = chatBox.scrollHeight;
    };

    async function callGemini(prompt) {
        const context = getSystemContext();
        const fullPrompt = `
            Sei un assistente finanziario integrato in un Business Planner.
            Usa questi dati dell'utente per rispondere in modo personalizzato:
            ${context}
            L'utente chiede: ${prompt}
            Rispondi in modo professionale, breve e focalizzato su consigli pratici.
        `;

        try {
            const result = await model.generateContent(fullPrompt);
            const response = await result.response; 
            return response.text();
        } catch (error) {
            console.error("Errore Gemini:", error);
            return "Ops! Ho difficoltà a connettermi ai dati. Riprova tra poco.";
        }
    }

    const handleSend = async () => {
        const text = userInput.value.trim();
        if (!text) return;

        appendMessage(text, 'user');
        userInput.value = '';

        const loadingDiv = document.createElement('div');
        loadingDiv.className = "Message AiMessage";
        loadingDiv.innerText = "Sto elaborando...";
        chatBox.appendChild(loadingDiv);

        const aiResponse = await callGemini(text);
        chatBox.removeChild(loadingDiv);
        appendMessage(aiResponse, 'ai');
    };

    sendBtn.addEventListener('click', handleSend);
    userInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') handleSend(); });

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

    resetBtn?.addEventListener('click', () => {
        if (confirm("Eliminare tutti i dati?")) {
            localStorage.clear();
            location.reload();
        }
    });
});