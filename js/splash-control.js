document.addEventListener("DOMContentLoaded", function() {
    const splash = document.getElementById("splash-screen");
    if (splash) {
        
        // --- MARCO DE 1.0 SEGUNDO ---
        setTimeout(function() {
            console.log("OIO: 1.0s - Disparando primeira onda de brilho");
            // Aqui você pode adicionar classes CSS ou tocar sons curtos
        }, 1000);

        // --- MARCO DE 1.5 SEGUNDOS ---
        setTimeout(function() {
            console.log("OIO: 1.5s - Distorção do gradiente em andamento");
        }, 1500);

        // --- MARCO DE 2.0 SEGUNDOS ---
        setTimeout(function() {
            console.log("OIO: 2.0s - Logo atinge o tamanho e brilho máximo");
        }, 2000);

        // --- MARCO DE 2.5 SEGUNDOS ---
        setTimeout(function() {
            console.log("OIO: 2.5s - Preparando estabilização visual");
        }, 2500);

        // --- MARCO DE 3.0 SEGUNDOS ---
        // Iniciamos o desvanecimento (fade-out) suave da cortina preta aqui
        setTimeout(function() {
            console.log("OIO: 3.0s - Cortina preta começa a sumir suavemente");
            splash.classList.add("splash-fade-out");
        }, 3000);

        // --- MARCO DE 3.5 SEGUNDOS ---
        // A cortina já está quase invisível, ótimo momento para liberar interações por baixo
        setTimeout(function() {
            console.log("OIO: 3.5s - Interface de chat totalmente revelada por baixo");
        }, 3500);

        // --- SEGURANÇA MÁXIMA: 4.0 SEGUNDOS ---
        // Destrói o elemento da memória apenas depois que todas as transições terminaram
        setTimeout(function() {
            console.log("OIO: 4.0s - Limpando a Splash Screen da memória do sistema");
            splash.remove();
        }, 4000);
        
    }
});
