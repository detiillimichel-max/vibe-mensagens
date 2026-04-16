/* MAESTRO E-HUB COM SOM E LIGAÇÃO - OIO ONE */

// 1. Definição dos sons e Toque de Telefone (Servidores Oficiais do Google)
const somClique = new Audio('https://actions.google.com/sounds/v1/office/button_push.ogg');
const somSucesso = new Audio('https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg');
const somTelefone = new Audio('https://actions.google.com/sounds/v1/alarms/phone_alerts_and_rings.ogg');
somTelefone.loop = true; // Faz o telefone ficar tocando sem parar

function tocarSom(tipo) {
    if (tipo === 'clique') somClique.play().catch(() => {});
    if (tipo === 'sucesso') somSucesso.play().catch(() => {});
    if (tipo === 'chamada') somTelefone.play().catch(() => {});
}

function pararToque() {
    somTelefone.pause();
    somTelefone.currentTime = 0;
}

// 2. Função principal de navegação
function abrirAppHub(servico) {
    tocarSom('clique');
    
    if (servico === 'toc_azul' || servico === 'videos') {
        window.location.href = "Toc-videos.html";
        return;
    }

    if (servico === 'nostalgia') {
        window.location.href = "nostalgia.html";
        return;
    }

    // LÓGICA DE LIGAÇÃO DIRETA
    if (servico === 'video_call') {
        // Pega o nome do usuário ou pergunta se não existir
        let meuNome = localStorage.getItem("vibe_user");
        if (!meuNome) {
            meuNome = prompt("Como você quer aparecer na chamada?", "Michel");
            localStorage.setItem("vibe_user", meuNome);
        }

        const linkChamada = 'https://vibe-mensagens.daily.co/vibe';

        firebase.database().ref("chamadas_ativas").set({
            quem_liga: meuNome,
            link: linkChamada,
            status: "chamando",
            timestamp: Date.now()
        });

        window.open(linkChamada, '_blank');
        if (typeof fecharGaveta === "function") fecharGaveta();
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

// 3. Sistema de Galeria, Social e IA (Mantenha igual)
function galeriaHub() {
    tocarSom('clique');
    const input = document.getElementById('fotoInput');
    if(input) { input.click(); if (typeof fecharGaveta === "function") fecharGaveta(); }
}

function darLike(idItem) {
    const user = localStorage.getItem("vibe_user") || "Usuario";
    firebase.database().ref("social_vibe").child(idItem).child("likes").child(user).set(true);
    tocarSom('sucesso');
}

function ativarIAVibe() {
    tocarSom('clique');
    window.geminiAtiva = true;
    alert("Vibe IA Ativada! Digite sua pergunta.");
}

// --- OUVINTE DE CHAMADAS COM SOM DE TOQUE ---
firebase.database().ref("chamadas_ativas").on("value", (snapshot) => {
    const chamada = snapshot.val();
    const meuNome = localStorage.getItem("vibe_user");

    if (chamada && chamada.status === "chamando" && chamada.quem_liga !== meuNome) {
        tocarSom('chamada'); // COMEÇA A TOCAR O TELEFONE
        
        setTimeout(() => { // Janela de confirmação
            if (confirm("📞 CHAMADA DE VÍDEO: " + chamada.quem_liga + " está ligando. Aceitar?")) {
                pararToque();
                window.open(chamada.link, '_blank');
                firebase.database().ref("chamadas_ativas").remove();
            } else {
                pararToque();
                firebase.database().ref("chamadas_ativas").remove();
            }
        }, 500);
    } else if (!chamada) {
        pararToque(); // Para de tocar se a chamada for cancelada
    }
});

console.log("Sistema Vibe: Toque e Identificação ativos!");
