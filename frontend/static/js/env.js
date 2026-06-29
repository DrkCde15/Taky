window.API_URL = (function () {
  // 1. Variável injetada por script server-side (mais prioritário)
  if (window.__API_URL__) return window.__API_URL__;
  // 2. Configuração persistida no navegador (antiga chave do React ou nova)
  const stored = localStorage.getItem('API_URL') || localStorage.getItem('VITE_API_URL');
  if (stored) return stored;
  // 3. Fallback — desenvolvimento local
  return 'http://localhost:8000';
})();
