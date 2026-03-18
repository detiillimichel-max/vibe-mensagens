/* MAESTRO E-HUB - OIO ONE 🚀 */

// Função que faz os ícones pularem para o lugar certo
function abrirAppHub(servico) {
    // Se clicar no ícone azul (toc_azul), pula para o app de vídeos
    if (servico === 'toc_azul' || servico === 'cine') {
        window.location.href = "Toc-videos.html";
        return;
    }

    let links = {
        'google': 'https://www.google.com.br',
        'youtube': 'https://www.youtube.com',
        'noticias': 'https://news.google.com',
        'prefeitura': 'https://www.bjperdoes.sp.gov.br'
    };

    if (links[servico]) {
        window.open(links[servico], '_blank');
        if (typeof fecharGaveta === "function") fecharGaveta();
    }
}

// Função da Galeria
function galeriaHub() {
    const input = document.getElementById('fotoInput');
    if(input) {
        input.click();
        if (typeof fecharGaveta === "function") fecharGaveta();
    }
}

// Sistema Social de Likes
const socialDb = firebase.database().ref("social_vibe");
function darLike(idItem) {
    const user = localStorage.getItem("vibe_user") || "Usuário";
    socialDb.child(idItem).child("likes").child(user).set(true);
    if(navigator.vibrate) navigator.vibrate(40);
}

console.log("✅ Maestro e-Hub com Ícone Azul Ativado!");
