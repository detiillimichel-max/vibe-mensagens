// vibe-privado.js
// Módulo de Conversas Individuais e Convites Externos (Protocolo Universal)

// 1. Lógica do Chat Privado (1 a 1)
window.abrirChatPrivado = function(nomeOutroUsuario) {
    const meuNome = localStorage.getItem("vibe_user");
    if (!meuNome) return;

    // Cria um ID de sala único juntando os dois nomes em ordem alfabética
    // Ex: "bibibi" e "michel" sempre vai gerar a sala "bibibi_michel"
    const arrayNomes = [meuNome.toLowerCase(), nomeOutroUsuario.toLowerCase()].sort();
    const idSalaSecreta = arrayNomes[0] + "_" + arrayNomes[1];

    console.log("Conectando na sala secreta: " + idSalaSecreta);
    
    // Alerta temporário para você saber que a lógica funcionou antes de mudarmos a tela
    if (typeof window.notificarVibe === 'function') {
        window.notificarVibe('Vibe Privado', 'Iniciando chat com ' + nomeOutroUsuario);
    } else {
        alert("Sala 1 a 1 ativada com " + nomeOutroUsuario);
    }

    // A próxima fase será fazer o chat limpar a tela e ler: 
    // firebase.database().ref("chat_privado/" + idSalaSecreta)
};

// 2. Lógica de Convite via WhatsApp
window.convidarViaWhatsApp = function(numeroTelefone) {
    // Limpa o número deixando só os números (tira traços, parênteses, etc)
    const numLimpo = numeroTelefone.replace(/\D/g, '');
    
    if (numLimpo.length < 10) {
        alert("Por favor, digite um número de telefone válido com DDD.");
        return;
    }

    // A mensagem padrão que será enviada
    const mensagem = "Vem pro Vibe OIO! A nossa rede social privada. Acesse e crie seu perfil: https://vibe-mensagens.vercel.app";
    
    // Monta o link mágico do WhatsApp
    // O '55' é o código do Brasil. Se o número já tiver 55, precisaremos de uma lógica extra depois, mas para testes isso é perfeito.
    const url = `https://wa.me/55${numLimpo}?text=${encodeURIComponent(mensagem)}`;
    
    // Abre o WhatsApp no celular do usuário
    window.open(url, '_blank');
};

// 3. Lógica de Convite via SMS
window.convidarViaSMS = function(numeroTelefone) {
    const numLimpo = numeroTelefone.replace(/\D/g, '');
    
    if (numLimpo.length < 10) {
        alert("Por favor, digite um número de telefone válido com DDD.");
        return;
    }

    const mensagem = "Vem pro Vibe OIO! Acesse: https://vibe-mensagens.vercel.app";
    
    // Monta o link mágico do SMS nativo do Android/iOS
    const url = `sms:+55${numLimpo}?body=${encodeURIComponent(mensagem)}`;
    
    window.open(url, '_blank');
};

