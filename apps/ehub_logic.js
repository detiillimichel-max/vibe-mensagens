/* MAESTRO E-HUB & PONTES - OIO ONE 🚀 */

// 1. Função que gerencia os saltos e links
function abrirAppHub(servico) {
    console.log("Maestro: Abrindo " + servico);

    // Salto para o Feed de Vídeos
    if (servico === 'toc_azul' || servico === 'videos') {
        window.location.href = "Toc-videos.html"; // Salto Quântico
        return;
    }

    // Salto para a sala de Nostalgia
    if (servico === 'nostalgia') {
        window.location.href = "nostalgia.html"; // Criaremos este arquivo depois
        return;
    }

    let links = {
        'google': 'https://www.google.com.br',
        'youtube': 'https://www.youtube.com',
        'noticias': 'https://news.google.com',
        'prefeitura': 'https://www.bjperdoes.sp.gov.br',
        'cine': 'https://www.youtube.com/results?search_query=filmes+completos+dublados',
        'jogos': 'https://www.agame.com/game/dominoes-classic'
    };

    if (links[servico]) {
        // Abre em uma nova aba para ferramentas e jogos
        window.open(links[servico], '_blank');
        if (typeof fecharGaveta === "function") fecharGaveta();
    }
}

// 2. Sistema Social de Likes (Base Compartilhada)
const socialDb = firebase.database().ref("social_vibe");
function darLike(idItem) {
    const user = localStorage.getItem("vibe_user") || "Usuário";
    socialDb.child(idItem).child("likes").child(user).set(true);
    if(navigator.vibrate) navigator.vibrate(40);
}

// 3. Função da Galeria
function galeriaHub() {
    const input = document.getElementById('fotoInput');
    if(input) {
        input.click();
        if (typeof fecharGaveta === "function") fecharGaveta();
    }
}

console.log("✅ Maestro e-Hub Blindado e Ativado!");

/* MAESTRO E-HUB COM SOM - OIO ONE 🚀 */

// 1. Definição dos sons (curtos e leves)
const somClique = new Audio('https://www.soundjay.com/buttons/sounds/button-16.mp3');
const somSucesso = new Audio('https://www.soundjay.com/communication/sounds/beep-07.mp3');

function tocarSom(tipo) {
    if (tipo === 'clique') somClique.play();
    if (tipo === 'sucesso') somSucesso.play();
}

// 2. Função de abrir apps com som
function abrirAppHub(servico) {
    tocarSom('clique'); // Toca o som ao clicar
    
    if (servico === 'toc_azul' || servico === 'videos') {
        window.location.href = "Toc-videos.html";
        return;
    }

    if (servico === 'nostalgia') {
        window.location.href = "nostalgia.html";
        return;
    }

    let links = {
        'google': 'https://www.google.com.br',
        'youtube': 'https://www.youtube.com',
        'noticias': 'https://news.google.com',
        'prefeitura': 'https://www.bjperdoes.sp.gov.br',
        'cine': 'https://www.youtube.com/results?search_query=filmes+completos+dublados',
        'jogos': 'https://www.agame.com/game/dominoes-classic'
    };

    if (links[servico]) {
        window.open(links[servico], '_blank');
        if (typeof fecharGaveta === "function") fecharGaveta();
    }
}

// 3. Sistema Social com Som de Like
const socialDb = firebase.database().ref("social_vibe");
function darLike(idItem) {
    const user = localStorage.getItem("vibe_user") || "Usuário";
    socialDb.child(idItem).child("likes").child(user).set(true);
    
    tocarSom('sucesso'); // Som de confirmação do like!
    if(navigator.vibrate) navigator.vibrate(40);
}

// 4. Galeria com som
function galeriaHub() {
    tocarSom('clique');
    const input = document.getElementById('fotoInput');
    if(input) {
        input.click();
        if (typeof fecharGaveta === "function") fecharGaveta();
    }
}

console.log("✅ Maestro com Som e Feedback Ativado!");
