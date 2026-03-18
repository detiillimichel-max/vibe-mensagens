/* MÓDULO NOSTALGIA - OIO ONE 📺 */

function carregarNostalgia() {
    // Aqui você pode adicionar links de desenhos de domínio público
    const desenhos = [
        { nome: "Desenho Antigo 1", link: "LINK_DO_YOUTUBE_AQUI" },
        { nome: "Desenho Antigo 2", link: "LINK_DO_YOUTUBE_AQUI" }
    ];
    console.log("📺 Lista de nostalgia pronta para curtir!");
}

// Reação com Emoji Nativo que você pediu 😊
function reagirNostalgia(emoji) {
    const user = localStorage.getItem("vibe_user") || "Usuário";
    // Salva no Firebase sem gastar quase nada
    firebase.database().ref("social_nostalgia").push({
        autor: user,
        reacao: emoji,
        data: Date.now()
    });
    
    if(navigator.vibrate) navigator.vibrate(30);
    alert("Você reagiu com " + emoji);
}

// Inicia o módulo
carregarNostalgia();
