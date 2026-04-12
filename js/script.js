// 1. Verificação e Firebase
let nick = localStorage.getItem("vibe_user");
if (!nick) window.location.href = "login.html";

const firebaseConfig = {
    apiKey: "AIzaSyAslIIn6h6NdVhuHdwXjS1EhAbItrAXq7Y",
    databaseURL: "https://vibe-app-bbba2-default-rtdb.firebaseio.com/",
    projectId: "vibe-app-bbba2"
};
if (!firebase.apps.length) { firebase.initializeApp(firebaseConfig); }
const db = firebase.database().ref("chat_vibe");

const somPlim = new Audio('assets/sounds/vibe.mp3');
let primeiraVez = true;

// 2. FUNÇÃO DE RENDERIZAÇÃO LUXURY
function renderizarVibe(m) {
    const isSent = m.autor === nick;
    const lado = isSent ? "sent" : "received";
    const hora = new Date(m.data || Date.now()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    const avatar = `https://ui-avatars.com/api/?name=${m.autor}&background=1a73e8&color=fff&rounded=true`;

    let corpo = m.tipo === 'foto' ? `<img src="${m.imagem}" style="width:100%; border-radius:12px;">` :
                m.tipo === 'audio' ? `<audio controls src="${m.audio}" style="width:100%;"></audio>` :
                `<span>${m.texto}</span>`;

    return `
        <div class="vibe-msg-container ${lado}">
            <div class="vibe-msg-avatar">
                <img src="assets/users/${m.autor.toLowerCase()}.jpg" onerror="this.src='${avatar}'">
            </div>
            <div class="vibe-msg-content">
                <div class="vibe-msg-header">
                    <strong>${m.autor}</strong> <span>${hora}</span>
                </div>
                <div class="vibe-msg-bubble">${corpo}</div>
            </div>
        </div>
    `;
}

db.limitToLast(20).on("child_added", snap => {
    const m = snap.val();
    const chat = document.getElementById("chat");
    if(!chat) return;

    const div = document.createElement("div");
    div.innerHTML = renderizarVibe(m);
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;

    if (m.autor !== nick && !primeiraVez) {
        somPlim.play().catch(() => {});
        if (typeof window.notificarVibe === 'function') {
            window.notificarVibe('Vibe 💬', m.autor + ': ' + (m.texto || 'Enviou mídia'));
        }
    }
});
setTimeout(() => { primeiraVez = false; }, 2000);

// 3. Funções de Envio (Mensagens e IA)
async function enviar() {
    const input = document.getElementById('msgInput');
    const texto = input.value.trim();
    if (!texto) return;

    if (texto.toLowerCase().startsWith('vibe ')) {
        const pergunta = texto.substring(5);
        input.value = "Consultando...";
        if (typeof obterRespostaIA === 'function') {
            const resposta = await obterRespostaIA(pergunta);
            db.push({ autor: "Vibe IA", texto: resposta, tipo: 'texto', data: Date.now() });
        }
    } else {
        db.push({ autor: nick, texto: texto, tipo: 'texto', data: Date.now() });
    }
    input.value = "";
}
document.getElementById('btnEnviar').onclick = enviar;

// 4. Funções de Mídia (Foto e Áudio)
const btnFoto = document.getElementById('btnFoto');
const fotoInput = document.getElementById('fotoInput');
if(btnFoto) btnFoto.onclick = () => fotoInput.click();
if(fotoInput) fotoInput.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => { db.push({ autor: nick, imagem: event.target.result, tipo: 'foto', data: Date.now() }); };
        reader.readAsDataURL(file);
    }
};

let mediaRecorder; let audioChunks = [];
const btnAudio = document.getElementById('btnAudio');
if(btnAudio) btnAudio.onclick = async () => {
    if (!mediaRecorder || mediaRecorder.state === "inactive") {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];
        mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            const reader = new FileReader();
            reader.onload = (event) => { db.push({ autor: nick, audio: event.target.result, tipo: 'audio', data: Date.now() }); };
            reader.readAsDataURL(audioBlob);
        };
        mediaRecorder.start(); btnAudio.style.color = "red"; 
    } else { mediaRecorder.stop(); btnAudio.style.color = "#1a73e8"; }
};

// 5. Controle da Gaveta e-Hub
function abrirGaveta() { 
    document.getElementById('gaveta-ehub').classList.add('aberta'); 
    if(navigator.vibrate) navigator.vibrate(30);
}
function fecharGaveta() { document.getElementById('gaveta-ehub').classList.remove('aberta'); }
