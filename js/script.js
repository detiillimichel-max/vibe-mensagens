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
const dbDigitando = firebase.database().ref("digitando_vibe"); // Nova referência para o status de digitação

const somPlim = new Audio('assets/sounds/vibe.mp3');
let primeiraVez = true;

// 2. FUNÇÃO DE RENDERIZAÇÃO LUXURY (Atualizada para CSS Premium e Fotos)
function renderizarVibe(m) {
    const isSent = m.autor === nick;
    const hora = new Date(m.data || Date.now()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    // Fallback: Gera a inicial se a foto não existir
    const avatarFallback = `https://ui-avatars.com/api/?name=${m.autor}&background=1a73e8&color=fff&rounded=true`;

    let corpo = m.tipo === 'foto' ? `<img src="${m.imagem}" style="width:100%; border-radius:12px;">` :
                m.tipo === 'audio' ? `<audio controls src="${m.audio}" style="width:100%;"></audio>` :
                `<span>${m.texto}</span>`;

    // Classes sincronizadas com vibe-chat.css
    return `
        <div class="mensagem-container ${isSent ? 'minha-mensagem' : ''}">
            <div class="vibe-avatar">
                <img src="assets/users/${m.autor.toLowerCase()}.jpg" onerror="this.src='${avatarFallback}'">
            </div>
            <div style="display:flex; flex-direction:column; max-width: 100%;">
                <div class="bolha">${corpo}</div>
                <span class="info-msg">${isSent ? '' : '<strong>'+m.autor+'</strong> • '} ${hora}</span>
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
    
    // Garante que o indicador de digitação fique sempre por último
    const indicador = document.getElementById("typing-indicator-box");
    if(indicador) chat.appendChild(indicador);
    
    chat.scrollTop = chat.scrollHeight;

    if (m.autor !== nick && !primeiraVez) {
        somPlim.play().catch(() => {});
        if (typeof window.notificarVibe === 'function') {
            window.notificarVibe('Vibe 💬', m.autor + ': ' + (m.texto || 'Enviou mídia'));
        }
    }
});
setTimeout(() => { primeiraVez = false; }, 2000);

// 3. Lógica do "Escrevendo..." (Tempo Real)
const inputMsg = document.getElementById('msgInput');
let typingTimeout;

if (inputMsg) {
    inputMsg.addEventListener('input', () => {
        if (inputMsg.value.trim().length > 0) {
            dbDigitando.child(nick).set(true);
            
            // Limpa o status se parar de digitar por 3 segundos
            clearTimeout(typingTimeout);
            typingTimeout = setTimeout(() => {
                dbDigitando.child(nick).remove();
            }, 3000);
        } else {
            dbDigitando.child(nick).remove();
        }
    });
}

// Escutando quem está digitando
dbDigitando.on("value", snap => {
    const digitando = snap.val();
    const chat = document.getElementById("chat");
    if (!chat) return;

    let alguemDigitando = false;
    let quem = "";

    if (digitando) {
        for (let pessoa in digitando) {
            if (pessoa !== nick) {
                alguemDigitando = true;
                quem = pessoa;
                break; // Mostra um por vez
            }
        }
    }

    let indicador = document.getElementById("typing-indicator-box");
    if (!indicador) {
        indicador = document.createElement("div");
        indicador.id = "typing-indicator-box";
        chat.appendChild(indicador);
    }

    if (alguemDigitando) {
        const avatarTyping = `https://ui-avatars.com/api/?name=${quem}&background=1a73e8&color=fff&rounded=true`;
        indicador.innerHTML = `
            <div class="mensagem-container" style="margin-top: 10px;">
                <div class="vibe-avatar">
                    <img src="assets/users/${quem.toLowerCase()}.jpg" onerror="this.src='${avatarTyping}'">
                </div>
                <div style="display:flex; flex-direction:column;">
                    <div class="bolha digitando-wrapper">
                        <div class="dot"></div><div class="dot"></div><div class="dot"></div>
                    </div>
                </div>
            </div>
        `;
        indicador.style.display = "flex";
        chat.scrollTop = chat.scrollHeight;
    } else {
        indicador.style.display = "none";
    }
});

// 4. Funções de Envio (Mensagens e IA)
async function enviar() {
    const input = document.getElementById('msgInput');
    const texto = input.value.trim();
    if (!texto) return;

    // Remove status de digitando ao enviar
    dbDigitando.child(nick).remove();
    clearTimeout(typingTimeout);

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
const btnEnviar = document.getElementById('btnEnviar');
if(btnEnviar) btnEnviar.onclick = enviar;

// Permitir envio com a tecla Enter
if(inputMsg) {
    inputMsg.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            enviar();
        }
    });
}

// 5. Funções de Mídia (Foto e Áudio)
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

// 6. Controle da Gaveta e-Hub
function abrirGaveta() { 
    const gaveta = document.getElementById('gaveta-ehub');
    if(gaveta) gaveta.classList.add('aberta'); 
    if(navigator.vibrate) navigator.vibrate(30);
}
function fecharGaveta() { 
    const gaveta = document.getElementById('gaveta-ehub');
    if(gaveta) gaveta.classList.remove('aberta'); 
}
