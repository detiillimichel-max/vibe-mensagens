const firebaseConfig = {
    apiKey: "AIzaSyAslIIn6h6NdVhuHdwXjS1EhAbItrAXq7Y",
    databaseURL: "https://vibe-app-bbba2-default-rtdb.firebaseio.com/",
    projectId: "vibe-app-bbba2"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database().ref("chat_vibe");

// REGRA GERAL: Pega o nome de quem logou. Se não logou, pergunta.
let nick = localStorage.getItem("vibe_user") || prompt("Seu nome:") || "Usuário";

// --- BOTÕES DE FOTO E ÁUDIO ---
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

// --- ENVIAR E RECEBER ---
function enviar() {
    const input = document.getElementById('msgInput');
    if (input && input.value.trim() !== "") {
        db.push({ autor: nick, texto: input.value, tipo: 'texto', data: Date.now() });
        input.value = "";
    }
}
if(document.getElementById('btnEnviar')) document.getElementById('btnEnviar').onclick = enviar;

db.limitToLast(20).on("child_added", snap => {
    const m = snap.val();
    const chat = document.getElementById("chat");
    if(!chat) return;
    const div = document.createElement("div");
    div.className = "balao";
    div.style.alignSelf = m.autor === nick ? "flex-end" : "flex-start";
    
    let fotoPerfil = `assets/users/${m.autor.toLowerCase()}.jpg`;
    let html = `<div style="display:flex;align-items:center;gap:5px;margin-bottom:5px;">
                <img src="${fotoPerfil}" onerror="this.src='https://ui-avatars.com/api/?name=${m.autor}'" style="width:20px;height:20px;border-radius:50%;">
                <small>${m.autor}</small></div>`;

    if (m.tipo === 'foto') html += `<img src="${m.imagem}" style="width:100%; border-radius:10px;">`;
    else if (m.tipo === 'audio') html += `<audio controls src="${m.audio}" style="width:100%;"></audio>`;
    else html += m.texto;

    div.innerHTML = html;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
});

// --- FUNÇÃO DE LOGIN ---
function fazerLogin() {
    const email = document.getElementById('email').value;
    if(email) {
        const nome = email.split('@')[0];
        localStorage.setItem("vibe_user", nome);
        window.location.href = "index.html";
    }
}
