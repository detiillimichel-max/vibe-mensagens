document.addEventListener("DOMContentLoaded", function() {
    const splash = document.getElementById("splash-screen");
    const logo = document.querySelector(".splash-logo");
    const circle = document.querySelector(".splash-circle");
    
    if (splash && logo && circle) {
        let chips = [];

        // 1. Injeta dinamicamente a camada de imagem por baixo de tudo
        const imgBg = document.createElement("div");
        imgBg.className = "splash-image-bg";
        // Imagem Inicial da abertura (Ex: Uma foto de estilo urbano ou gradiente premium)
        imgBg.style.backgroundImage = "url('assets/vibe-bg1.jpg')"; 
        circle.insertBefore(imgBg, logo);

        // Movimento lento de rotação/zoom contínuo na imagem de fundo
        imgBg.style.transform = "scale(1.2) rotate(5deg)";

        // --- 1.0 SEGUNDO: O VIBE SE DESINTEGRA ---
        setTimeout(function() {
            logo.classList.add("logo-disintegrate");
        }, 1000);

        // --- 1.5 SEGUNDOS: VIRANDO PROCESSADORES PELA TELA + TROCA DE IMAGEM ---
        setTimeout(function() {
            // Estilo Motorola: Muda a imagem de fundo lá dentro no momento do impacto!
            imgBg.style.backgroundImage = "url('assets/vibe-bg2.jpg')";
            imgBg.style.transform = "scale(1.1) rotate(-5deg)";

            // Criação dos 8 microchips de processador
            for (let i = 0; i < 8; i++) {
                const chip = document.createElement("div");
                chip.className = "processor-chip";
                circle.appendChild(chip);
                chips.push(chip);
                
                const randomX = (Math.random() - 0.5) * 100;
                const randomY = (Math.random() - 0.5) * 100;
                
                void chip.offsetWidth; 
                
                chip.style.opacity = "1";
                chip.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${Math.random() * 360}deg)`;
            }
        }, 1500);

        // --- 2.0 SEGUNDOS: CONVERGEM NO CENTRO ---
        setTimeout(function() {
            chips.forEach(chip => {
                chip.style.transform = "translate(0px, 0px) scale(1.2)";
                chip.style.background = "#7928ca";
                chip.style.boxShadow = "0 0 15px #7928ca";
            });
        }, 2000);

        // --- 2.5 SEGUNDOS: EXPANSÃO 360 GRAUS PARA AS BORDAS + TERCEIRA IMAGEM ---
        setTimeout(function() {
            // Próxima imagem sincronizada com a explosão radial para as bordas!
            imgBg.style.backgroundImage = "url('assets/vibe-bg3.jpg')";
            imgBg.style.transform = "scale(1.3) rotate(0deg)";

            chips.forEach((chip, index) => {
                const angle = (index * 45) * (Math.PI / 180);
                const radius = 68; 
                const borderX = Math.cos(angle) * radius;
                const borderY = Math.sin(angle) * radius;
                
                chip.style.background = "#ff4b4b"; 
                chip.style.boxShadow = "0 0 20px #ff4b4b";
                chip.style.transform = `translate(${borderX}px, ${borderY}px) rotate(${index * 45}deg) scale(0.8)`;
            });
        }, 2500);

        // --- 3.0 SEGUNDOS: PULSO ESTÁTICO NAS BORDAS ---
        setTimeout(function() {
            chips.forEach(chip => {
                chip.style.opacity = "0.5";
            });
        }, 3000);

        // --- 3.5 SEGUNDOS: O ÍCONE REJUNTA (FUSÃO FINAL) ---
        setTimeout(function() {
            // Recolhe os microchips
            chips.forEach(chip => {
                chip.style.transform = "translate(0px, 0px) scale(0)";
                chip.style.opacity = "0";
            });
            
            // Traz a marca VIBE de volta com brilho máximo sobre a última imagem de fundo
            logo.classList.remove("logo-disintegrate");
            logo.style.textShadow = "0 0 30px #00e5ff, 0 0 60px #ffffff";
        }, 3500);

        // --- 4.2 SEGUNDOS: FADE OUT DA TELA PRETA INTEIRA ---
        setTimeout(function() {
            splash.classList.add("splash-fade-out");
        }, 4200);

        // --- 4.8 SEGUNDOS: LIMPEZA COMPLETA DA MEMÓRIA ---
        setTimeout(function() {
            chips.forEach(chip => chip.remove());
            imgBg.remove();
            splash.remove();
        }, 4800);
    }
});
