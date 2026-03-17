const firebaseConfig = {
    apiKey: "AIzaSyAslIIn6h6NdVhuHdwXjS1EhAbItrAXq7Y",
    databaseURL: "https://vibe-app-bbba2-default-rtdb.firebaseio.com/",
    projectId: "vibe-app-bbba2"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database().ref("chat_vibe");

let nick = "Michel"; 

// --- CONTROLE DE FOTO ---
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

// --- CONTROLE DE ÁUDIO (ENVIO REAL) ---
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
            
            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                const reader = new FileReader();
                reader.onload = (event) => {
                    // ENVIANDO O ÁUDIO PARA O FIREBASE
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

// --- ENVIAR MENSAGEM ---
function enviar() {
    const input = document.getElementById('msgInput');
    if (input && input.value.trim() !== "") {
        db.push({ autor: nick, texto: input.value, tipo: 'texto', data: Date.now() });
        input.value = "";
    }
}
if(document.getElementById('btnEnviar')) document.getElementById('btnEnviar').onclick = enviar;

// --- RECEBER MENSAGENS (TEXTO, FOTO E ÁUDIO) ---
db.limitToLast(20).on("child_added", snap => {
    const m = snap.val();
    const chat = document.getElementById("chat");
    if(!chat) return;

    const div = document.createElement("div");
    div.className = "balao";
    div.style.alignSelf = m.autor === nick ? "flex-end" : "flex-start";
    
    let htmlContent = `<strong>${m.autor}</strong><br>`;

    if (m.tipo === 'foto') {
        htmlContent += `<img src="${m.imagem}" style="width:100%; border-radius:10px; margin-top:5px;">`;
    } else if (m.tipo === 'audio') {
        // CRIA O PLAYER DE ÁUDIO NO CHAT
        htmlContent += `<audio controls src="${m.audio}" style="width:100%; margin-top:5px;"></audio>`;
    } else {
        htmlContent += m.texto;
    }
    
    div.innerHTML = htmlContent;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
});

// --- LOGIN ---
function fazerLogin() {
    const email = document.getElementById('email').value;
    const senha = document.getElementById('password').value;
    if(email && senha) {
        nick = email.split('@')[0];
        window.location.href = "index.html"; 
    }
}
