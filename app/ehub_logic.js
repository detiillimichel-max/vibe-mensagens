/* MAESTRO E-HUB COM SOM - OIO ONE */

// 1. Definicao dos sons
const somClique = new Audio('https://www.soundjay.com/buttons/sounds/button-16.mp3');
const somSucesso = new Audio('https://www.soundjay.com/communication/sounds/beep-07.mp3');

function tocarSom(tipo) {
    if (tipo === 'clique') somClique.play().catch(() => {});
    if (tipo === 'sucesso') somSucesso.play().catch(() => {});
}

// 2. Funcao principal de navegacao
function abrirAppHub(servico) {
    tocarSom('clique');
    
    // Saltos Quanticos (HTMLs na Raiz)
    if (servico === 'toc_azul' || servico === 'videos') {
        window.location.href = "Toc-videos.html";
        return;
    }

    if (servico === 'nostalgia') {
        window.location.href = "nostalgia.html";
        return;
    }

    // Links Externos
    let links = {
        'google': 'https://www.google.com.br',
        'youtube': 'https://www.youtube.com',
        'noticias': 'https://news.google.com',
        'prefeitura': 'https://www.bjperdoes.sp.gov.br',
        'cine': 'https://www.youtube.com/results?search_query=filmes+completos+dublados',
        'jogos': 'https://www.agame.com/game/dominoes-classic',
        'video_call': 'https://vibe-mensagens.daily.co/vibe' 
    };

    if (links[servico]) {
        window.open(links[servico], '_blank');
        if (typeof fecharGaveta === "function") fecharGaveta();
    }
}

// 3. Sistema de Galeria e Social
function galeriaHub() {
    tocarSom('clique');
    const input = document.getElementById('fotoInput');
    if(input) {
        input.click();
        if (typeof fecharGaveta === "function") fecharGaveta();
    }
}

function darLike(idItem) {
    const user = localStorage.getItem("vibe_user") || "Usuario";
    firebase.database().ref("social_vibe").child(idItem).child("likes").child(user).set(true);
    tocarSom('sucesso');
    if(navigator.vibrate) navigator.vibrate(40);
}

// 4. Integracao IA Gemini (Gatilho Seguro)
function ativarIAVibe() {
    tocarSom('clique');
    window.geminiAtiva = true;
    alert("Vibe IA Ativada! Digite sua pergunta e envie.");
    if (typeof fecharGaveta === "function") fecharGaveta();
}

console.log("Maestro OIO ONE: Som e Navegacao configurados!");
