const wsClient = (() => {
  let ws = null;
  let projectId = null;
  let url = '';
  let reconnectAttempts = 0;
  const maxReconnectAttempts = 5;
  const listeners = {};

  function connect(pid) {
    if (ws && projectId === pid) return;
    disconnect();
    projectId = pid;
    const base = window.API_URL || 'http://localhost:8000';
    const wsBase = base.replace(/^http/, 'ws');
    url = `${wsBase}/ws/projects/${pid}`;
    setupConnection();
  }

  function setupConnection() {
    ws = new WebSocket(url);
    ws.onopen = () => { reconnectAttempts = 0; };
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.event && listeners[data.event]) {
          listeners[data.event].forEach(cb => cb(data.data));
        }
      } catch {}
    };
    ws.onclose = () => attemptReconnect();
    ws.onerror = () => ws?.close();
  }

  function attemptReconnect() {
    if (reconnectAttempts < maxReconnectAttempts) {
      reconnectAttempts++;
      setTimeout(() => setupConnection(), 2000 * reconnectAttempts);
    }
  }

  function disconnect() {
    if (ws) { ws.close(); ws = null; }
    projectId = null;
  }

  function on(event, callback) {
    if (!listeners[event]) listeners[event] = [];
    listeners[event].push(callback);
  }

  function off(event, callback) {
    if (!listeners[event]) return;
    listeners[event] = listeners[event].filter(cb => cb !== callback);
  }

  function clearListeners() {
    Object.keys(listeners).forEach(k => delete listeners[k]);
  }

  return { connect, disconnect, on, off, clearListeners };
})();
