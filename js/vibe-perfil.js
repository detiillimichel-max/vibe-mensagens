// vibe-perfil.js
// Módulo de Super Perfil, Reels e Círculos de Privacidade (Protocolo Universal)

// Nova pasta no seu Firebase exclusiva para organizar os perfis sem misturar com o chat
const dbPerfis = firebase.database().ref("perfis_vibe");

const VibePerfil = {
    nomeAtual: () => localStorage.getItem("vibe_user"),

    // 1. Atualizar Bio e Links (Ex: Canal do YouTube, Lojinha Mercado Livre)
    salvarDadosPerfil: function(bioTexto, urlExterna) {
        const usuario = this.nomeAtual();
        if (!usuario) return;

        dbPerfis.child(usuario).update({
            bio: bioTexto,
            link: urlExterna,
            ultimaAtualizacao: Date.now()
        });
        console.log("OIO ONE: Perfil atualizado com sucesso.");
    },

    // 2. Sistema de Depoimentos (Inspirado no Orkut)
    enviarDepoimento: function(paraQuem, texto) {
        const deQuem = this.nomeAtual();
        if (!deQuem) return;

        // Salva o depoimento na página do amigo
        dbPerfis.child(paraQuem).child("depoimentos").push({
            autor: deQuem,
            mensagem: texto,
            data: Date.now()
        });
        alert(`Depoimento enviado para ${paraQuem}!`);
    },

    // 3. Sistema de Círculos (Inspirado no Google+)
    adicionarAoCirculo: function(amigo, nomeCirculo) {
        const usuario = this.nomeAtual();
        if (!usuario) return;

        // Exemplo: Coloca a "bibibi" no círculo "Familia"
        dbPerfis.child(usuario).child("circulos").child(nomeCirculo).update({
            [amigo]: true
        });
        console.log(`OIO ONE: ${amigo} adicionado ao círculo ${nomeCirculo}.`);
    },

    // 4. Lógica de Upload Seguro (3 Fotos e 1 Vídeo Curto)
    // Usaremos essa função quando criarmos a tela de perfil no HTML
    adicionarMidiaPerfil: function(tipoMidia, base64Data) {
        const usuario = this.nomeAtual();
        if (!usuario) return;

        const refMidia = dbPerfis.child(usuario).child("midia");

        refMidia.once('value', (snap) => {
            const midiasAtuais = snap.val() || { fotos: [], video: null };
            
            if (tipoMidia === 'foto') {
                // Checa o limite de 3 fotos
                let fotos = midiasAtuais.fotos ? Object.values(midiasAtuais.fotos) : [];
                if (fotos.length >= 3) {
                    alert("Limite máximo de 3 fotos atingido! Apague uma para enviar outra.");
                    return;
                }
                refMidia.child("fotos").push(base64Data);
                alert("Foto adicionada ao seu mural!");

            } else if (tipoMidia === 'video') {
                // Substitui o Reel atual pelo novo (Limite 1)
                refMidia.update({ video: base64Data });
                alert("Reel atualizado com sucesso!");
            }
        });
    },

    // 5. Selo Top Fan (Quem mais interage)
    // Esta função será chamada cada vez que você receber uma mensagem no chat individual
    registrarInteracao: function(comQuem) {
        const usuario = this.nomeAtual();
        if (!usuario) return;

        const refInteracao = dbPerfis.child(usuario).child("interacoes").child(comQuem);
        
        refInteracao.once('value', snap => {
            let pontos = snap.val() || 0;
            refInteracao.set(pontos + 1);
        });
    }
};

