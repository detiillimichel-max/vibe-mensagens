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
const dbDigitando = firebase.database().ref("digitando_vibe");
const dbUsuarios = firebase.database().ref("usuarios_vibe");

const somPlim = new Audio('assets/sounds/vibe.mp3');
let primeiraVez = true;
let avataresCache = {};

// 2. Lógica de Upload da Foto de Perfil
const inputPerfil = document.createElement('input');
inputPerfil.type = 'file';
inputPerfil.accept = 'image/*';
inputPerfil.style.display = 'none';
document.body.appendChild(inputPerfil);

inputPerfil.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const base64 = event.target.result;
            dbUsuarios.child(nick).set({ foto: base64 }).catch(()=>{});
            if (typeof window.notificarVibe === 'function') {
                window.notificarVibe('Vibe', 'Foto de perfil atualizada!');
            }
        };
        reader.readAsDataURL(file);
    }
};

window.mudarFotoPerfil = function() {
    inputPerfil.click();
};

dbUsuarios.on("value", snap => {
    avataresCache = snap.val() || {};
    document.querySelectorAll('.avatar-img').forEach(img => {
        const autorMsg = img.getAttribute('data-autor');
        if (avataresCache[autorMsg] && avataresCache[autorMsg].foto) {
            img.src = avataresCache[autorMsg].foto;
        }
    });
});

// 3. FUNÇÃO DE RENDERIZAÇÃO LUXURY
function renderizarVibe(m) {
    const isSent = m.autor === nick;
    const hora = new Date(m.data || Date.now()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    const fotoSalva = avataresCache[m.autor] ? avataresCache[m.autor].foto : null;
    const avatarFallback = `https://ui-avatars.com/api/?name=${m.autor}&background=1a73e8&color=fff&rounded=true`;
    const srcFinal = fotoSalva || avatarFallback;

    let corpo = m.tipo === 'foto' ? `<img src="${m.imagem}" style="width:100%; border-radius:12px;">` :
                m.tipo === 'audio' ? `<audio controls src="${m.audio}" style="width:100%;"></audio>` :
                `<span>${m.texto}</span>`;

    const acaoClique = isSent ? `onclick="window.mudarFotoPerfil()"` : '';
    const estiloClique = isSent ? `cursor: pointer; border: 2px solid #00e5ff; box-shadow: 0 0 10px rgba(0,229,255,0.5);` : '';

    return `
        <div class="mensagem-container ${isSent ? 'minha-mensagem' : ''}">
            <div class="vibe-avatar" ${acaoClique} style="${estiloClique}" title="${isSent ? 'Mudar foto de perfil' : ''}">
                <img src="${srcFinal}" class="avatar-img" data-autor="${m.autor}" onerror="this.src='${avatarFallback}'">
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

// 4. Lógica do "Escrevendo..." BLINDADA
const inputMsg = document.getElementById('msgInput');
let typingTimeout;

if (inputMsg) {
    inputMsg.addEventListener('input', () => {
        if (inputMsg.value.trim().length > 0) {
            try { dbDigitando.child(nick).set(true).catch(()=>{}); } catch(e){}
            clearTimeout(typingTimeout);
            typingTimeout = setTimeout(() => {
                try { dbDigitando.child(nick).remove().catch(()=>{}); } catch(e){}
            }, 3000);
        } else {
            try { dbDigitando.child(nick).remove().catch(()=>{}); } catch(e){}
        }
    });
}

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
                break;
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
        const fotoDigitando = avataresCache[quem] ? avataresCache[quem].foto : null;
        const avatarTyping = `https://ui-avatars.com/api/?name=${quem}&background=1a73e8&color=fff&rounded=true`;
        const srcFinal = fotoDigitando || avatarTyping;

        indicador.innerHTML = `
            <div class="mensagem-container" style="margin-top: 10px;">
                <div class="vibe-avatar">
                    <img src="${srcFinal}" class="avatar-img" data-autor="${quem}" onerror="this.src='${avatarTyping}'">
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

// 5. Funções de Envio - CORRIGIDAS E PROTEGIDAS
async function enviar() {
    const input = document.getElementById('msgInput');
    const texto = input.value.trim();
    if (!texto) return;

    // Tenta remover o digitando, mas SE FALHAR, IGNORA E CONTINUA!
    try { 
        dbDigitando.child(nick).remove().catch(()=>{}); 
    } catch(e) { console.log("Erro no digitando ignorado"); }
    
    clearTimeout(typingTimeout);

    if (texto.toLowerCase().startsWith('vibe ')) {
        const pergunta = texto.substring(5);
        input.value = "Consultando...";
        if (typeof obterRespostaIA === 'function') {
            const resposta = await obterRespostaIA(pergunta);
            db.push({ autor: "Vibe IA", texto: resposta, tipo: 'texto', data: Date.now() }).catch(()=>{});
        }
    } else {
        // Envia a mensagem com .catch para não quebrar a aplicação
        db.push({ autor: nick, texto: texto, tipo: 'texto', data: Date.now() }).catch(()=>{});
    }
    input.value = "";
}

const btnEnviar = document.getElementById('btnEnviar');
if(btnEnviar) btnEnviar.onclick = enviar;

if(inputMsg) {
    inputMsg.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            enviar();
        }
    });
}

// 6. Funções de Mídia (Foto e Áudio)
const btnFoto = document.getElementById('btnFoto');
const fotoInput = document.getElementById('fotoInput');
if(btnFoto) btnFoto.onclick = () => fotoInput.click();
if(fotoInput) fotoInput.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => { 
            db.push({ autor: nick, imagem: event.target.result, tipo: 'foto', data: Date.now() }).catch(()=>{}); 
        };
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
            reader.onload = (event) => { 
                db.push({ autor: nick, audio: event.target.result, tipo: 'audio', data: Date.now() }).catch(()=>{}); 
            };
            reader.readAsDataURL(audioBlob);
        };
        mediaRecorder.start(); btnAudio.style.color = "red"; 
    } else { mediaRecorder.stop(); btnAudio.style.color = "#1a73e8"; }
};

// 7. Controle da Gaveta e-Hub
function abrirGaveta() { 
    const gaveta = document.getElementById('gaveta-ehub');
    if(gaveta) gaveta.classList.add('aberta'); 
    if(navigator.vibrate) navigator.vibrate(30);
}
function fecharGaveta() { 
    const gaveta = document.getElementById('gaveta-ehub');
    if(gaveta) gaveta.classList.remove('aberta'); 
}
