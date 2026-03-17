const firebaseConfig = {
    apiKey: "AIzaSyAslIIn6h6NdVhuHdwXjS1EhAbItrAXq7Y",
    databaseURL: "https://vibe-app-bbba2-default-rtdb.firebaseio.com/",
    projectId: "vibe-app-bbba2"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database().refconst somPlim = new Audio('assets/sounds/vibe.mp3');
("chat_vibe");

// Pega o nome de quem logou
let nick = localStorage.getItem("vibe_user") || "Usuário";

// --- ENVIAR FOTO ---
const btnFoto = document.getElementById('btnFoto');
const fotoInput = document.getElementById('fotoInput');
if(btnFoto) btnFoto.onclick = () => fotoInput.click();

fotoInput.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            db.push({ autor: nick, imagem: event.target.result, tipo: 'foto', data: Date.now() });
        };
        reader.readAsDataURL(file);
    }
};

// --- ENVIAR ÁUDIO ---
let mediaRecorder;
let audioChunks = [];
const btnAudio = document.getElementById('btnAudio');
if(btnAudio) {
    btnAudio.onclick = async () => {
        if (!mediaRecorder || mediaRecorder.state === "inactive") {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream);
            audioChunks = [];
            mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                const reader = new FileReader();
                reader.onload = (event) => {
                    db.push({ autor: nick, audio: event.target.result, tipo: 'audio', data: Date.now() });
                };
                reader.readAsDataURL(audioBlob);
            };
            mediaRecorder.start();
            btnAudio.style.color = "red"; 
        } else {
            mediaRecorder.stop();
            btnAudio.style.color = "#1a73e8";
        }
    };
}

// --- ENVIAR TEXTO ---
function enviar() {
    const input = document.getElementById('msgInput');
    if (input && input.value.trim() !== "") {
        db.push({ autor: nick, texto: input.value, tipo: 'texto', data: Date.now() });
        input.value = "";
    }
}
if(document.getElementById('btnEnviar')) document.getElementById('btnEnviar').onclick = enviar;

// --- RECEBER TUDO (COM INTELIGÊNCIA DE AVATAR) ---
db.limitToLast(20).on("child_added", snap => {
    const m = snap.val();
    const chat = document.getElementById("chat");
    if(!chat) return;

    const div = document.createElement("div");
    div.className = "balao";
    div.style.alignSelf = m.autor === nick ? "flex-end" : "flex-start";
    
    let fotoPerfil = `assets/users/${m.autor.toLowerCase()}.jpg`;
    let avatarFallback = `https://ui-avatars.com/api/?name=${m.autor}&background=1a73e8&color=fff&rounded=true`;

    let topo = `<div style="display:flex; align-items:center; gap:8px; margin-bottom:5px;">
                    <img src="${fotoPerfil}" onerror="this.src='${avatarFallback}'" style="width:25px; height:25px; border-radius:50%; object-fit: cover;">
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
});
somPlim.play().catch(() => console.log("Som aguardando clique"));
