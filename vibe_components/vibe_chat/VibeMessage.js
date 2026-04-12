const VibeMessage = {
    render: function(config) {
        const side = config.sent ? 'sent' : 'received';
        
        // Se typing for true, mostra os três pontinhos, se não, mostra o texto
        const messageBody = config.typing ? 
            `<div class="typing-dots"><span>.</span><span>.</span><span>.</span></div>` : 
            config.text;

        return `
            <div class="vibe-msg-container ${side}">
                <div class="vibe-msg-avatar">
                    <img src="${config.avatar}" alt="foto">
                </div>
                <div class="vibe-msg-content">
                    <div class="vibe-msg-header">
                        <span class="vibe-msg-name">${config.name}</span>
                        <span class="vibe-msg-time">${config.time}</span>
                    </div>
                    <div class="vibe-msg-bubble">
                        ${messageBody}
                    </div>
                </div>
            </div>
        `;
    }
};

window.VibeMessage = VibeMessage;

