// app/tv_logic.js

(function initTVPlayer() {
    // Cria o elemento do modal apenas se ele não existir
    if (!document.getElementById('video-player-modal')) {
        const modalHTML = `
            <div id="video-player-modal" style="display: none; position: fixed; inset: 0; background: rgba(0, 0, 0, 0.85); backdrop-filter: blur(15px); z-index: 10000; justify-content: center; align-items: center; flex-direction: column;">
                <div style="width: 90%; max-width: 500px; background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 20px; padding: 20px; color: white; text-align: center; box-shadow: 0 8px 32px rgba(0,0,0,0.37);">
                    <button onclick="fecharPlayer()" style="background: #2563eb; color: white; border: none; padding: 12px 25px; border-radius: 30px; font-weight: bold; margin-bottom: 20px; cursor: pointer;">← VOLTAR</button>
                    <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 15px; background: #000;">
                        <iframe id="video-frame" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>
                    </div>
                    <h3 id="video-titulo" style="margin-top: 15px; font-family: sans-serif; font-weight: 300;">Carregando...</h3>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
})();

// Função global para ser chamada pelos ícones do Hub
window.abrirVideo = function(url, titulo) {
    const modal = document.getElementById('video-player-modal');
    const iframe = document.getElementById('video-frame');
    const tituloTxt = document.getElementById('video-titulo');

    let embedUrl = url;
    
    // Converte links comuns do YouTube para o formato Embed (necessário para Iframes)
    if (url.includes("youtube.com/watch?v=")) {
        const videoId = url.split("v=")[1].split("&")[0];
        embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    } else if (url.includes("youtu.be/")) {
        const videoId = url.split("youtu.be/")[1];
        embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }

    iframe.src = embedUrl;
    tituloTxt.innerText = titulo;
    modal.style.display = 'flex';
};

window.fecharPlayer = function() {
    const modal = document.getElementById('video-player-modal');
    const iframe = document.getElementById('video-frame');
    modal.style.display = 'none';
    iframe.src = ""; // Para o vídeo imediatamente
};

