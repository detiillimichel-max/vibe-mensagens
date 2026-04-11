// 1. Verificação de Segurança (Login)
let nick = localStorage.getItem("vibe_user");
if (!nick) {
    window.location.href = "login.html";
}

// 2. Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAslIIn6h6NdVhuHdwXjS1EhAbItrAXq7Y",
    databaseURL: "https://vibe-app-bbba2-default-rtdb.firebaseio.com/",
    projectId: "vibe-app-bbba2"
};
if (!firebase.apps.length) { firebase.initializeApp(firebaseConfig); }
const db = firebase.database().ref("chat_vibe");

// 3. Som e Recebimento
const somPlim = new Audio('assets/sounds/vibe.mp3');
let primeiraVez = true;

db.limitToLast(20).on("child_added", snap => {
    const m = snap.val();
    const chat = document.getElementById("chat");
    if(!chat) return;

    const div = document.createElement("div");
    div.className = "balao";
    div.style.alignSelf = m.autor === nick ? "flex-end" : "flex-start";
    
    let avatarFallback = `https://ui-avatars.com/api/?name=${m.autor}&background=1a73e8&color=fff&rounded=true`;
    let topo = `<div style="display:flex; align-items:center; gap:8px; margin-bottom:5px;">
                    <img src="assets/users/${m.autor.toLowerCase()}.jpg" onerror="this.src='${avatarFallback}'" style="width:25px; height:25px; border-radius:50%;">
                    <strong style="font-size:12px; color:#1a73e8;">${m.autor}</strong>
                </div>`;

    if (m.tipo === 'foto') {
        div.innerHTML = topo + `<img src="${m.imagem}" style="width:100%; border-radius:10px;">`;
    } else if (m.tipo === 'audio') {
        div.innerHTML = topo + `<audio controls src="${m.audio}" style="width:100%;"></audio>`;
    } else {
        div.innerHTML = topo + `<span>${m.texto}</span>`;
    }
    
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;

    if (m.autor !== nick && !primeiraVez) {
        somPlim.play().catch(() => {});
        if (typeof window.notificarVibe === 'function') {
            window.notificarVibe('Vibe Mensagens 💬', m.autor + ': ' + (m.texto || (m.tipo === 'foto' ? '📷 Foto' : '🎤 Áudio')));
        }
    }
});

setTimeout(() => { primeiraVez = false; }, 2000);

// 4. Funções de Envio (ATUALIZADO COM IA)
async function enviar() {
    const input = document.getElementById('msgInput');
    if (!input || input.value.trim() === "") return;

    const texto = input.value.trim();

    // Lógica da IA: Se começar com "vibe "
    if (texto.toLowerCase().startsWith('vibe ')) {
        const pergunta = texto.substring(5);
        input.value = "Consultando a vibe...";
        
        if (typeof obterRespostaIA === 'function') {
            const resposta = await obterRespostaIA(pergunta);
            window.notificarVibe('OIO ONE IA', resposta);
            // Opcional: Salvar a resposta da IA no chat para todos verem
            db.push({ autor: "Vibe IA", texto: resposta, tipo: 'texto', data: Date.now() });
        }
        input.value = "";
    } else {
        // Envio normal para o Firebase
        db.push({ autor: nick, texto: texto, tipo: 'texto', data: Date.now() });
        input.value = "";
    }
}

document.getElementById('btnEnviar').onclick = enviar;

const btnFoto = document.getElementById('btnFoto');
const fotoInput = document.getElementById('fotoInput');
btnFoto.onclick = () => fotoInput.click();
fotoInput.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => { db.push({ autor: nick, imagem: event.target.result, tipo: 'foto', data: Date.now() }); };
        reader.readAsDataURL(file);
    }
};

let mediaRecorder; let audioChunks = [];
const btnAudio = document.getElementById('btnAudio');
btnAudio.onclick = async () => {
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
