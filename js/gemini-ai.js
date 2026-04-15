// gemini-ai.js
// Módulo de Inteligência Artificial Premium (Vibe IA) - Protocolo Universal

// Configuração da API
const apiKey = "AIzaSyA3cNz026IdiXVV6f-aeNSxD6IFI8iULI4";
const urlGemini = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

// 1. Função Central de Raciocínio da IA
window.obterRespostaIA = async function(mensagemContexto, isResumo = false) {
    const nomeUsuario = localStorage.getItem("vibe_user") || "Usuário";
    
    let promptSistema = `Você é a Vibe IA, a assistente premium da rede social Vibe OIO. O usuário que está falando com você agora se chama ${nomeUsuario}. 
    Regras:
    - Responda de forma extremamente curta, inteligente e amigável.
    - Ajude com ideias rápidas, traduções ou dúvidas.
    - Nunca use formatação pesada. Seja limpa.`;
    
    if (isResumo) {
        promptSistema = `Você é a Vibe IA. O usuário ${nomeUsuario} recebeu um conteúdo longo. Sua missão é ler o conteúdo e criar um resumo ultra curto (máximo de 15 palavras) dizendo o assunto principal. Comece com "Resumo: "`;
    }

    const payload = {
        contents: [{ parts: [{ text: `${promptSistema}\n\nConteúdo/Pergunta: ${mensagemContexto}` }] }]
    };

    try {
        const resposta = await fetch(urlGemini, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const dados = await resposta.json();
        if (dados.candidates && dados.candidates.length > 0) {
            return dados.candidates[0].content.parts[0].text.trim();
        } else {
            return "Vibe IA: Minha sintonia falhou por um instante. Tente novamente.";
        }
    } catch (erro) {
        console.error("Erro na Vibe IA:", erro);
        return "Vibe IA: Estou offline. Verifique a conexão.";
    }
};

window.resumirComIA = async function(textoLongo) {
    return await window.obterRespostaIA(textoLongo, true);
};

// 2. Injeção Visual da IA (Glassmorphism Style)
function injetarInterfaceIA() {
    // Remove botão antigo se existir
    const antigo = document.getElementById("btn-vibe-ia");
    if(antigo) antigo.remove();

    const btnIA = document.createElement("div");
    btnIA.id = "btn-vibe-ia";
    // NOVO ÍCONE: fa-sparkles (Brilhos Mágicos Tecnológicos)
    btnIA.innerHTML = '<i class="fa-solid fa-sparkles"></i>';
    btnIA.style.cssText = `
        position: fixed; bottom: 85px; right: 20px; width: 55px; height: 55px;
        background: rgba(26, 115, 232, 0.2); /* Azul translúcido */
        backdrop-filter: blur(10px); /* Efeito de vidro */
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1); /* Borda sutil de vidro */
        border-radius: 50%;
        display: flex; align-items: center; justify-content: center; 
        color: #00e5ff; /* Ciano brilhante para contraste */
        font-size: 22px; 
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        cursor: pointer; z-index: 1000; transition: 0.3s ease;
    `;
    
    // Efeito de toque
    btnIA.onmousedown = () => {
        btnIA.style.transform = "scale(0.9)";
        btnIA.style.background = "rgba(26, 115, 232, 0.4)";
    };
    btnIA.onmouseup = () => {
        btnIA.style.transform = "scale(1)";
        btnIA.style.background = "rgba(26, 115, 232, 0.2)";
    };

    btnIA.onclick = async () => {
        const pergunta = prompt("Vibe IA: O que você precisa, " + (localStorage.getItem("vibe_user") || "Usuário") + "?");
        if (pergunta && pergunta.trim() !== "") {
            // Notificação Premium (sem emoji)
            if (typeof window.OioSom === 'object' && typeof window.OioSom.clique === 'function') {
                window.OioSom.clique();
            }
            
            const resposta = await window.obterRespostaIA(pergunta);
            
            // Alerta limpo
            alert("Vibe IA diz:\n\n" + resposta);
        }
    };

    document.body.appendChild(btnIA);
}

// Inicia a interface da IA garantindo que o FontAwesome esteja carregado
window.addEventListener('load', injetarInterfaceIA);
