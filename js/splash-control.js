document.addEventListener("DOMContentLoaded", function() {
    const splash = document.getElementById("splash-screen");
    if (splash) {
        // Aos 2.1  segundos inicia o desvanecimento suave da cortina preta
        setTimeout(function() {
            splash.classList.add("splash-fade-out");
        }, 2700);
        
        // Aos 2.8 segundos o HTML é completamente limpo do sistema operacional
        setTimeout(function() {
            splash.remove();
        }, 3300);
    }
});
