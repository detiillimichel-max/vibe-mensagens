// vibe-acoes.js
// Módulo de Menu de Ações Rápidas (Estilo Telegram/WhatsApp) - Protocolo Universal

const VibeAcoes = {
    // Cria o menu flutuante estilo Telegram ao clicar em um avatar
    abrirMenuUsuario: function(nomeAmigo, urlFoto) {
        // Remove menu anterior se existir para não duplicar
        this.fecharMenu();

        // Fallback de foto
        const fotoFinal = urlFoto || `https://ui-avatars.com/api/?name=${nomeAmigo}&background=1a73e8&color=fff&rounded=true`;

        // Cria o container do menu (Design Glassmorphism Premium)
        const menuOverlay = document.createElement("div");
        menuOverlay.id = "vibe-menu-overlay";
        menuOverlay.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(5px); -webkit-backdrop-filter: blur(5px);
            display: flex; flex-direction: column; justify-content: flex-end;
            z-index: 3000; opacity: 0; transition: opacity 0.3s ease;
        `;

        // Conteúdo do menu
        const menuContent = document.createElement("div");
        menuContent.style.cssText = `
            background: #161b22; border-radius: 25px 25px 0 0; padding: 20px;
            transform: translateY(100%); transition: transform 0.3s ease;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
        `;

        menuContent.innerHTML = `
            <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 25px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 15px;">
                <img src="${fotoFinal}" style="width: 50px; height: 50px; border-radius: 50%; border: 2px solid #1a73e8; object-fit: cover;">
                <div>
                    <h3 style="color: #fff; margin: 0; font-size: 18px;">${nomeAmigo}</h3>
                    <span style="color: #00e5ff; font-size: 12px;">Usuário Vibe</span>
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; text-align: center; margin-bottom: 20px;">
                <div onclick="window.abrirChatPrivado('${nomeAmigo}')" style="cursor: pointer;">
                    <div style="background: rgba(26,115,232,0.2); width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 5px; color: #1a73e8; font-size: 20px;">
                        <i class="fa-solid fa-comment"></i>
                    </div>
                    <span style="color: #aaa; font-size: 11px;">Mensagem</span>
                </div>
                
                <div onclick="window.iniciarChamadaVideo('${nomeAmigo}')" style="cursor: pointer;">
                    <div style="background: rgba(0,229,255,0.2); width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 5px; color: #00e5ff; font-size: 20px;">
                        <i class="fa-solid fa-video"></i>
                    </div>
                    <span style="color: #aaa; font-size: 11px;">Vídeo</span>
                </div>

                <div onclick="VibeAcoes.favoritarUsuario('${nomeAmigo}')" style="cursor: pointer;">
                    <div style="background: rgba(255,193,7,0.2); width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 5px; color: #ffc107; font-size: 20px;">
                        <i class="fa-solid fa-star"></i>
                    </div>
                    <span style="color: #aaa; font-size: 11px;">Favoritar</span>
                </div>

                <div onclick="VibeAcoes.verPerfilCompleto('${nomeAmigo}')" style="cursor: pointer;">
                    <div style="background: rgba(255,255,255,0.1); width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 5px; color: #fff; font-size: 20px;">
                        <i class="fa-solid fa-circle-info"></i>
                    </div>
                    <span style="color: #aaa; font-size: 11px;">Perfil</span>
                </div>
            </div>
        `;

        menuOverlay.appendChild(menuContent);
        document.body.appendChild(menuOverlay);

        // Animação de entrada
        requestAnimationFrame(() => {
            menuOverlay.style.opacity = "1";
            menuContent.style.transform = "translateY(0)";
        });

        // Clicar fora fecha o menu
        menuOverlay.onclick = (e) => {
            if (e.target === menuOverlay) this.fecharMenu();
        };
    },

    fecharMenu: function() {
        const menu = document.getElementById("vibe-menu-overlay");
        if (menu) {
            menu.style.opacity = "0";
            menu.children[0].style.transform = "translateY(100%)";
            setTimeout(() => menu.remove(), 300);
        }
    },

    favoritarUsuario: function(nomeAmigo) {
        // Lógica simples para salvar nos favoritos usando o nome de login
        alert(nomeAmigo + " adicionado aos Favoritos!");
        this.fecharMenu();
    },

    verPerfilCompleto: function(nomeAmigo) {
        // Preparação para chamar a tela de perfil (Reels, Bio, Depoimentos)
        alert("Abrindo o Super Perfil de " + nomeAmigo + "...");
        this.fecharMenu();
    }
};

// Vincula a função ao escopo global para o index.html conseguir chamar depois
window.abrirMenuTelegram = (nome, foto) => VibeAcoes.abrirMenuUsuario(nome, foto);
