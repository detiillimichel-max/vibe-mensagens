document.addEventListener("DOMContentLoaded", function() {
    const splash = document.getElementById("splash-screen");
    const logo = document.querySelector(".splash-logo");
    const circle = document.querySelector(".splash-circle");
    
    if (splash && logo && circle) {
        let chips = [];

        // --- 1.0 SEGUNDO: O VIBE SE DESINTEGRA ---
        setTimeout(function() {
            logo.classList.add("logo-disintegrate");
        }, 1000);

        // --- 1.5 SEGUNDOS: VIRANDO PROCESSADORES ANDANDO PELA TELA ---
        setTimeout(function() {
            // Criamos 8 processadores simulados na física do círculo
            for (let i = 0; i < 8; i++) {
                const chip = document.createElement("div");
                chip.className = "processor-chip";
                circle.appendChild(chip);
                chips.push(chip);
                
                // Espalha eles em posições aleatórias "andando" pelo espaço interno
                const randomX = (Math.random() - 0.5) * 100;
                const randomY = (Math.random() - 0.5) * 100;
                
                // Força o navegador a processar o estado antes de aplicar o estilo
                void chip.offsetWidth; 
                
                chip.style.opacity = "1";
                chip.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${Math.random() * 360}deg)`;
            }
        }, 1500);

        // --- 2.0 SEGUNDOS: TODOS CONVERGEM NO CENTRO EXATO ---
        setTimeout(function() {
            chips.forEach(chip => {
                chip.style.transform = "translate(0px, 0px) scale(1.2)";
                chip.style.background = "#7928ca"; // Muda de cor na compressão
                chip.style.boxShadow = "0 0 15px #7928ca";
            });
        }, 2000);

        // --- 2.5 SEGUNDOS: EXPANSÃO RADIAL 360 GRAUS PARA AS BORDAS ---
        setTimeout(function() {
            chips.forEach((chip, index) => {
                // Divide o círculo perfeitamente em 8 direções (360 / 8 = 45 graus cada)
                const angle = (index * 45) * (Math.PI / 180);
                const radius = 68; // Distância empurrando quase na borda do círculo de 170px
                const borderX = Math.cos(angle) * radius;
                const borderY = Math.sin(angle) * radius;
                
                chip.style.background = "#ff4b4b"; // Cor de impacto na borda
                chip.style.boxShadow = "0 0 20px #ff4b4b";
                chip.style.transform = `translate(${borderX}px, ${borderY}px) rotate(${index * 45}deg) scale(0.8)`;
            });
        }, 2500);

        // --- 3.0 SEGUNDOS: FINALIZANDO A CHEGADA NAS BORDAS (PULSO ESTÁTICO) ---
        setTimeout(function() {
            chips.forEach(chip => {
                chip.style.opacity = "0.5";
            });
        }, 3000);

        // --- 3.5 SEGUNDOS: O ÍCONE REJUNTA (FUSÃO DE RETORNO DO LOGO) ---
        setTimeout(function() {
            // Recolhe e esconde os microchips
            chips.forEach(chip => {
                chip.style.transform = "translate(0px, 0px) scale(0)";
                chip.style.opacity = "0";
            });
            
            // Traz a marca de volta com força total e um flash de luz
            logo.classList.remove("logo-disintegrate");
            logo.style.textShadow = "0 0 30px #00e5ff, 0 0 60px #ffffff";
        }, 3500);

        // --- 4.2 SEGUNDOS: INICIA FADE OUT DO PROJETO ---
        setTimeout(function() {
            splash.classList.add("splash-fade-out");
        }, 4200);

        // --- 4.8 SEGUNDOS: LIMPEZA TOTAL DA MEMÓRIA ---
        setTimeout(function() {
            chips.forEach(chip => chip.remove());
            splash.remove();
        }, 4800);
    }
});
