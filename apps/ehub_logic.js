/* MAESTRO E-HUB - OIO ONE 🚀 */

function abrirAppHub(servico) {
    // Salto para o Feed de Vídeos Estilo TikTok
    if (servico === 'toc_azul' || servico === 'videos') {
        window.location.href = "Toc-videos.html";
        return;
    }

    // Links de Jogos (Imagem 1)
    if (servico === 'jogos') {
        window.open('https://www.agame.com/game/dominoes-classic', '_blank');
        return;
    }

    let links = {
        'google': 'https://www.google.com.br',
        'youtube': 'https://www.youtube.com',
        'noticias': 'https://news.google.com',
        'prefeitura': 'https://www.bjperdoes.sp.gov.br',
        'cine': 'https://www.youtube.com/results?search_query=filmes+completos+dublados'
    };

    if (links[servico]) {
        window.open(links[servico], '_blank');
        if (typeof fecharGaveta === "function") fecharGaveta();
    }
}

// Ativa a Galeria para postar no Feed
function galeriaHub() {
    const input = document.getElementById('fotoInput');
    if(input) {
        input.click();
        if (typeof fecharGaveta === "function") fecharGaveta();
    }
}
