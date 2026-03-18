/* OIO ONE - LÓGICA DO FEED DE VÍDEOS 🚀 */

// 1. Conexão com o Banco de Dados
const firebaseConfig = {
    apiKey: "AIzaSyAslIIn6h6NdVhuHdwXjS1EhAbItrAXq7Y",
    databaseURL: "https://vibe-app-bbba2-default-rtdb.firebaseio.com/",
    projectId: "vibe-app-bbba2"
};

// Inicializa apenas se ainda não estiver inicializado
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const dbVideos = firebase.database().ref("vibe_feed_videos");

// 2. Pegar o usuário logado (Dinamismo Total)
const usuarioAtivo = localStorage.getItem("vibe_user") || "Usuário";

// 3. Função para carregar os vídeos na tela
dbVideos.on("child_added", snap => {
    const v = snap.val();
    const feed = document.getElementById("feed");
    
    const card = document.createElement("div");
    card.className = "card-video";
    
    // Aqui o nome do autor vem direto do banco de dados (Nada de nomes fixos!)
    card.innerHTML = `
        <div class="video-player">
            <video src="${v.url}" controls style="width:100%; border-radius:15px;"></video>
        </div>
        <p style="color:white; margin:10px 0;"><strong>@${v.autor}</strong>: ${v.legenda}</p>
        <div class="social-bar">
            <button class="btn-social" onclick="curtirVideo('${snap.key}')">❤️</button>
            <button class="btn-social" onclick="window.location.href='index.html'">💬 Chat</button>
        </div>
    `;
    feed.prepend(card); // O vídeo novo aparece no topo!
});

// 4. Função de Curtir com Emoji Nativo
function curtirVideo(idVideo) {
    if(navigator.vibrate) navigator.vibrate(50);
    // Lógica para salvar o like no Firebase
    firebase.database().ref("vibe_feed_videos/" + idVideo + "/likes").push(usuarioAtivo);
}

console.log("🎬 Universo de Vídeos OIO carregado para: " + usuarioAtivo);
