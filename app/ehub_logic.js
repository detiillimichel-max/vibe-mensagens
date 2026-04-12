/* MAESTRO E-HUB COM SOM - OIO ONE */

// 1. Definição dos sons
const somClique = new Audio('https://www.soundjay.com/buttons/sounds/button-16.mp3');
const somSucesso = new Audio('https://www.soundjay.com/communication/sounds/beep-07.mp3');

function tocarSom(tipo) {
    if (tipo === 'clique') somClique.play().catch(() => {});
    if (tipo === 'sucesso') somSucesso.play().catch(() => {});
}

// 2. Função principal de navegação
function abrirAppHub(servico) {
    tocarSom('clique');
    
    // Saltos Quânticos (HTMLs na Raiz)
    if (servico === 'toc_azul' || servico === 'videos') {
        window.location.href = "Toc-videos.html";
        return;
    }

    if (servico === 'nostalgia') {
        window.location.href = "nostalgia.html";
        return;
    }

    // --- LÓGICA DE LIGAÇÃO DIRETA (VIDEO CALL) ---
    if (servico === 'video_call') {
        const meuNome = localStorage.getItem("vibe_user") || "Michel";
        const linkChamada = 'https://vibe-mensagens.daily.co/vibe';

        // 1. Grava no Firebase que você está ligando para todos ouvirem
        firebase.database().ref("chamadas_ativas").set({
            quem_liga: meuNome,
            link: linkChamada,
            status: "chamando",
            timestamp: Date.now()
        });

        // 2. Abre a sua própria tela de vídeo
        window.open(linkChamada, '_blank');
        if (typeof fecharGaveta === "function") fecharGaveta();
        return;
    }

    // Links Externos Restantes
    let links = {
        'google': 'https://www.google.com.br',
        'youtube': 'https://www.youtube.com',
        'noticias': 'https://news.google.com',
        'prefeitura': 'https://www.bjperdoes.sp.gov.br',
        'cine': 'https://www.youtube.com/results?search_query=filmes+completos+dublados',
        'jogos': 'https://www.agame.com/game/dominoes-classic'
        // video_call removido daqui e colocado na lógica acima
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

// 4. Integração IA Gemini (Gatilho Seguro)
function ativarIAVibe() {
    tocarSom('clique');
    window.geminiAtiva = true;
    alert("Vibe IA Ativada! Digite sua pergunta e envie.");
    if (typeof fecharGaveta === "function") fecharGaveta();
}

// --- OUVINTE DE CHAMADAS (O TOQUE DO TELEFONE) ---
// Este código roda em segundo plano esperando alguém ligar
firebase.database().ref("chamadas_ativas").on("value", (snapshot) => {
    const chamada = snapshot.val();
    const meuNome = localStorage.getItem("vibe_user") || "Visitante";

    // Se houver uma chamada ativa e NÃO fui eu que comecei
    if (chamada && chamada.status === "chamando" && chamada.quem_liga !== meuNome) {
        tocarSom('sucesso'); // Toca um som para avisar
        if (confirm(chamada.quem_liga + " está te ligando para vídeo. Aceitar?")) {
            window.open(chamada.link, '_blank');
            // Limpa o Firebase para a chamada encerrar
            firebase.database().ref("chamadas_ativas").remove();
        }
    }
});

console.log("Maestro OIO ONE: Sistema de Ligação Direta Ativo!");
