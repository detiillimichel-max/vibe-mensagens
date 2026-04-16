// 1. Verificação e Firebase (Mantenha igual)
let nick = localStorage.getItem("vibe_user");
if (!nick) window.location.href = "login.html";

const firebaseConfig = {
    apiKey: "AIzaSyAslIIn6h6NdVhuHdwXjS1EhAbItrAXq7Y",
    databaseURL: "https://vibe-app-bbba2-default-rtdb.firebaseio.com/",
    projectId: "vibe-app-bbba2"
};
if (!firebase.apps.length) { firebase.initializeApp(firebaseConfig); }

const db = firebase.database().ref("chat_vibe");
const dbUsuarios = firebase.database().ref("usuarios_vibe"); // Banco de dados para os avatares

const somPlim = new Audio('assets/sounds/vibe.mp3');
let primeiraVez = true;
let avataresCache = {}; // Memória rápida para as fotos de perfil

// 2. Lógica de Upload da Foto de Perfil (Invisível no HTML)
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
            // Salva a nova foto no Firebase amarrada ao nome do usuário
            dbUsuarios.child(nick).set({ foto: base64 });
            if (typeof window.notificarVibe === 'function') {
                window.notificarVibe('Vibe', 'Foto de perfil atualizada!');
            }
        };
        reader.readAsDataURL(file);
    }
};

window.mudarFotoPerfil = function() {
    inputPerfil.click(); // Abre a galeria ao clicar no próprio avatar
};

// Escuta as mudanças de fotos de perfil em tempo real
dbUsuarios.on("value", snap => {
    avataresCache = snap.val() || {};
    // Atualiza todas as fotos que já estão na tela na mesma hora
    document.querySelectorAll('.avatar-img').forEach(img => {
        const autorMsg = img.getAttribute('data-autor');
        if (avataresCache[autorMsg] && avataresCache[autorMsg].foto) {
            img.src = avataresCache[autorMsg].foto;
        }
    });
});

// 3. FUNÇÃO DE RENDERIZAÇÃO LUXURY (Com Clique no Avatar)
function renderizarVibe(m) {
    const isSent = m.autor === nick;
    const hora = new Date(m.data || Date.now()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    // Procura no Firebase se a pessoa tem foto, senão usa as iniciais
    const fotoSalva = avataresCache[m.autor] ? avataresCache[m.autor].foto : null;
    const avatarFallback = `https://ui-avatars.com/api/?name=${m.autor}&background=1a73e8&color=fff&rounded=true`;
    const srcFinal = fotoSalva || avatarFallback;

    let corpo = m.tipo === 'foto' ? `<img src="${m.imagem}" style="width:100%; border-radius:12px;">` :
                m.tipo === 'audio' ? `<audio controls src="${m.audio}" style="width:100%;"></audio>` :
                `<span>${m.texto}</span>`;

    // Apenas o dono da mensagem pode clicar no avatar para trocar a foto
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

// 4. Recebimento de Mensagens (Ouvir Banco em Tempo Real)
db.limitToLast(20).on("child_added", snap => {
    const m = snap.val();
    const chat = document.getElementById("chat");
    if(!chat) return;

    // Adiciona a mensagem formatada ao chat
    const div = document.createElement("div");
    div.innerHTML = renderizarVibe(m);
    chat.appendChild(div);
    
    // Auto-scroll para baixo
    chat.scrollTop = chat.scrollHeight;

    // Toca som se for de outra pessoa
    if (m.autor !== nick && !primeiraVez) {
        somPlim.play().catch(() => {});
        if (typeof window.notificarVibe === 'function') {
            window.notificarVibe('Vibe 💬', m.autor + ': ' + (m.texto || 'Enviou mídia'));
        }
    }
});
setTimeout(() => { primeiraVez = false; }, 2000);

// 5. Funções de Envio (Mantenha sua Lógica de IA)
async function enviar() {
    const input = document.getElementById('msgInput');
    const texto = input.value.trim();
    if (!texto) return;

    if (texto.toLowerCase().startsWith('vibe ')) {
        const pergunta = texto.substring(5);
        input.value = "Consultando a vibe...";
        if (typeof obterRespostaIA === 'function') {
            const resposta = await obterRespostaIA(pergunta);
            db.push({ autor: "Vibe IA", texto: resposta, tipo: 'texto', data: Date.now() });
        }
        input.value = "";
    } else {
        // Envio normal com som de clique (Opcional)
        // somPlim.play().catch(()=>{}); 
        db.push({ autor: nick, texto: texto, tipo: 'texto', data: Date.now() });
        input.value = "";
    }
}
const btnEnviar = document.getElementById('btnEnviar');
if(btnEnviar) btnEnviar.onclick = enviar;

const inputMsg = document.getElementById('msgInput');
if(inputMsg) {
    inputMsg.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            enviar();
        }
    });
}

// 6. Funções de Mídia (Mantenha as Originais)
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
