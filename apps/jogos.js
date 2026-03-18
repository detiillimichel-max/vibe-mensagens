/* LÓGICA VIBE VÍDEOS (Estilo TikTok) 🚀 */

const dbVideos = firebase.database().ref("vibe_videos_galeria");

// Função para voltar ao Chat (O botão VOLTAR da sua imagem)
function voltarParaChat() {
    window.location.href = "index.html";
}

// Escuta a Galeria e cria os Cards com Curtidas
dbVideos.on("child_added", snap => {
    const v = snap.val();
    const feed = document.getElementById("feed");
    
    const card = document.createElement("div");
    card.className = "card-video";
    card.innerHTML = `
        <video src="${v.url}" controls style="width:100%; border-radius:15px;"></video>
        <div style="display:flex; justify-content:space-between; padding:10px; color:white;">
            <span>@${v.autor}</span>
            <span onclick="curtirVideo('${snap.key}')" style="cursor:pointer;">❤️ Curtir</span>
        </div>
    `;
    feed.prepend(card);
});

function curtirVideo(id) {
    const user = localStorage.getItem("vibe_user") || "Usuário";
    dbVideos.child(id).child("likes").child(user).set(true);
    if(navigator.vibrate) navigator.vibrate(50); // Vibração nativa
}
