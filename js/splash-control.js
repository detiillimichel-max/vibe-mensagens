document.addEventListener("DOMContentLoaded", function() {
    const splash = document.getElementById("splash-screen");
    if (splash) {
        // Aos 2.5 segundos, inicia o efeito suave de sumiço (fade-out)
        setTimeout(function() {
            splash.classList.add("splash-fade-out");
        }, 2500);
        
        // Aos 3.1 segundos, apaga a tag do HTML limpando totalmente a memória
        setTimeout(function() {
            splash.remove();
        }, 3100);
    }
});

