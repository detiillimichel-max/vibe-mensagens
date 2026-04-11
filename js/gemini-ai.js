// js/gemini-ai.js
const AI_CONFIG = {
    key: "AIzaSyA3cNz026IdiXVV6f-aeNSxD6IFI8iULI4",
    url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
};

async function obterRespostaIA(mensagem) {
    try {
        const response = await fetch(`${AI_CONFIG.url}?key=${AI_CONFIG.key}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `Responda como um assistente profissional da Vibe: ${mensagem}` }] }]
            })
        });
        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (e) {
        return "Estou processando muitas vibrações agora. Pode repetir?";
    }
}
