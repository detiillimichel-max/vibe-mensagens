// vibe-config.js
// Módulo de Configurações, Segurança e Personalização (Protocolo Universal)

const VibeConfig = {
    // 1. Sair da Conta (Logout Seguro)
    sairDaConta: function() {
        if (confirm("Tem certeza que deseja sair do Vibe OIO?")) {
            localStorage.removeItem("vibe_user");
            window.location.href = "login.html"; // Redireciona para o login que usa Nome e Senha
        }
    },

    // 2. Personalização: Papel de Parede (Salvo apenas no celular para não pesar o Firebase)
    mudarPapelDeParede: function() {
        const inputFundo = document.createElement('input');
        inputFundo.type = 'file';
        inputFundo.accept = 'image/*';
        
        inputFundo.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const base64 = event.target.result;
                    localStorage.setItem("vibe_wallpaper", base64);
                    this.aplicarPapelDeParede();
                    alert("Papel de parede atualizado com sucesso!");
                };
                reader.readAsDataURL(file);
            }
        };
        inputFundo.click();
    },

    // Applica o fundo se existir salvo
    aplicarPapelDeParede: function() {
        const fundoSalvo = localStorage.getItem("vibe_wallpaper");
        const chat = document.getElementById("chat");
        if (fundoSalvo && chat) {
            chat.style.backgroundImage = `url(${fundoSalvo})`;
            chat.style.backgroundSize = "cover";
            chat.style.backgroundPosition = "center";
            chat.style.backgroundAttachment = "fixed";
        }
    },

    // 3. Suporte: Contato Direto com o Arquiteto
    falarComSuporte: function() {
        const assunto = encodeURIComponent("Suporte Vibe OIO - Relato de Usuário");
        const corpo = encodeURIComponent("Olá Michel,\n\nPreciso de ajuda com o app...\n\nMeu usuário é: " + localStorage.getItem("vibe_user"));
        window.location.href = `mailto:detiillimichel@gmail.com?subject=${assunto}&body=${corpo}`;
    },

    // 4. Privacidade e Segurança
    mostrarPoliticaPrivacidade: function() {
        alert("🔒 Política de Privacidade Vibe OIO\n\n1. Suas conversas privadas na sala 1 a 1 são isoladas.\n2. O login é feito de forma segura usando apenas Nome e Senha.\n3. Suas fotos e áudios pertencem a você.\n\nDesenvolvido pela arquitetura OIO ONE.");
    },

    // 5. Dados de Armazenamento (Verifica o peso local)
    verificarArmazenamento: function() {
        let _lsTotal = 0, _xLen, _x;
        for (_x in localStorage) {
            if (!localStorage.hasOwnProperty(_x)) { continue; }
            _xLen = ((localStorage[_x].length + _x.length) * 2);
            _lsTotal += _xLen;
        }
        const kb = (_lsTotal / 1024).toFixed(2);
        alert(`💾 Dados de Armazenamento Local:\n\nSeu app está consumindo aproximadamente ${kb} KB de memória cache no seu dispositivo.`);
    }
};

// Quando o arquivo carrega, ele já tenta aplicar o papel de parede se o usuário tiver escolhido um antes
document.addEventListener("DOMContentLoaded", () => {
    VibeConfig.aplicarPapelDeParede();
});

