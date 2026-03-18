/* MAESTRO E-HUB - OIO ONE 🚀 */

function abrirAppHub(servico) {
    if (servico === 'toc_azul') {
        window.location.href = "Toc-videos.html"; // Salto para App de Vídeos
        return;
    }
    
    if (servico === 'jogos') {
        // Abre o link do dominó que você gostou
        window.open('https://www.agame.com/game/dominoes-classic', '_blank');
        if (typeof fecharGaveta === "function") fecharGaveta();
        return;
    }

    let links = {
        'google': 'https://www.google.com.br',
        'youtube': 'https://www.youtube.com',
        'noticias': 'https://news.google.com',
        'prefeitura': 'https://www.bjperdoes.sp.gov.br',
        'nostalgia': 'https://www.youtube.com/results?search_query=desenhos+antigos+completos'
    };

    if (links[servico]) {
        window.open(links[servico], '_blank');
        if (typeof fecharGaveta === "function") fecharGaveta();
    }
}

function galeriaHub() {
    const input = document.getElementById('fotoInput');
    if(input) {
        input.click();
        if (typeof fecharGaveta === "function") fecharGaveta();
    }
}
