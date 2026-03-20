function formatarVibe() {
  const agora = new Date();
  const hoje = agora.toLocaleDateString('pt-BR');
  const horaAtual = agora.toLocaleTimeString('pt-BR', { hour: '2-2-digit', minute: '2-2-digit' });
  
  // Verifica se é a primeira vez que abre no dia
  const ultimoAcesso = localStorage.getItem('ultimo_acesso_oio');

  if (ultimoAcesso !== hoje) {
    // É um novo dia! Salva o novo dia e retorna Data + Hora
    localStorage.setItem('ultimo_acesso_oio', hoje);
    return `📅 ${hoje} - ⏰ ${horaAtual}`;
  } else {
    // Já abriu hoje, retorna apenas a Hora
    return `⏰ ${horaAtual}`;
  }
}

// Para usar na tela:
document.getElementById('sua-vibe-info').innerHTML = formatarVibe();
      
