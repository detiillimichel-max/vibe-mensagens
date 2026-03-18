/* MÓDULO DE JOGOS - OIO ONE 🎮 */

function abrirJogo(tipo) {
    const jogos = {
        'domino': 'https://www.agame.com/game/dominoes-classic',
        'xadrez': 'https://www.agame.com/game/chess-classic'
    };

    if (jogos[tipo]) {
        // Abre o jogo em uma camada por cima, sem fechar o app
        window.open(jogos[tipo], '_blank');
    }
}

// Sistema de Likes para os Jogos (Emoji Nativo 👍)
function curtirJogo(nomeJogo) {
    const user = localStorage.getItem("vibe_user") || "Jogador";
    firebase.database().ref("likes_jogos").child(nomeJogo).push(user);
    
    if(navigator.vibrate) navigator.vibrate([30, 30]);
    console.log("Você curtiu o jogo: " + nomeJogo);
}

console.log("🎮 Módulo de Jogos pronto para o OIO ONE!");
