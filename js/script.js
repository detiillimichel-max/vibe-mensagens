const firebaseConfig = {
    apiKey: "AIzaSyAslIIn6h6NdVhuHdwXjS1EhAbItrAXq7Y",
    databaseURL: "https://vibe-app-bbba2-default-rtdb.firebaseio.com/",
    projectId: "vibe-app-bbba2"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database().ref("chat_vibe");
let nick = prompt("Seu nome:") || "Michel";

// --- CONTROLE DE FOTO ---
const btnFoto = document.getElementById('btnFoto');
const fotoInput = document.getElementById('fotoInput');

btnFoto.onclick = () => fotoInput.click();

fotoInput.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            // Envia a imagem como texto (Base64) por enquanto para testar
            db.push({ autor: nick, imagem: event.target.result, tipo: 'foto' });
        };
        reader.readAsDataURL(file);
    }
};

// --- CONTROLE DE ÁUDIO ---
let mediaRecorder;
let audioChunks = [];

document.getElementById('btnAudio').onclick = async () => {
    if (!mediaRecorder || mediaRecorder.state === "inactive") {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];
        mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
        mediaRecorder.onstop = () => {
            alert("Áudio gravado! Próximo passo: Enviar para a pasta assets/sounds.");
        };
        mediaRecorder.start();
        document.getElementById('btnAudio').style.color = "red"; // Fica vermelho gravando
    } else {
        mediaRecorder.stop();
        document.getElementById('btnAudio').style.color = "#1a73e8";
    }
};

// --- ENVIAR MENSAGEM ---
function enviar() {
    const input = document.getElementById('msgInput');
    if (input.value.trim() !== "") {
        db.push({ autor: nick, texto: input.value, tipo: 'texto' });
        input.value = "";
    }
}
document.getElementById('btnEnviar').onclick = enviar;

// --- RECEBER MENSAGENS (TEXTO E FOTO) ---
db.limitToLast(20).on("child_added", snap => {
    const m = snap.val();
    const div = document.createElement("div");
    div.className = "balao";
    div.style.alignSelf = m.autor === nick ? "flex-end" : "flex-start";
    
    if (m.tipo === 'foto') {
        div.innerHTML = `<strong>${m.autor}</strong><br><img src="${m.imagem}" style="width:100%; border-radius:10px; margin-top:5px;">`;
    } else {
        div.innerHTML = `<strong>${m.autor}</strong><br>${m.texto}`;
    }
    
    document.getElementById("chat").appendChild(div);
    document.getElementById("chat").scrollTop = document.getElementById("chat").scrollHeight;
});
