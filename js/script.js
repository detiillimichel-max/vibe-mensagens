const firebaseConfig = {
    apiKey: "AIzaSyAslIIn6h6NdVhuHdwXjS1EhAbItrAXq7Y",
    databaseURL: "https://vibe-app-bbba2-default-rtdb.firebaseio.com/",
    projectId: "vibe-app-bbba2"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database().ref("chat_vibe");
let nick = prompt("Seu nome:") || "Michel";

// Ligar Câmera
document.getElementById('btnFoto').onclick = () => document.getElementById('fotoInput').click();

// Enviar Mensagem
function enviar() {
    const input = document.getElementById('msgInput');
    if (input.value.trim() !== "") {
        db.push({ autor: nick, texto: input.value });
        input.value = "";
    }
}
document.getElementById('btnEnviar').onclick = enviar;

// Receber Mensagens
db.limitToLast(20).on("child_added", snap => {
    const m = snap.val();
    const div = document.createElement("div");
    div.className = "balao";
    div.style.alignSelf = m.autor === nick ? "flex-end" : "flex-start";
    div.innerHTML = `<strong>${m.autor}</strong><br>${m.texto}`;
    document.getElementById("chat").appendChild(div);
    document.getElementById("chat").scrollTop = document.getElementById("chat").scrollHeight;
});
