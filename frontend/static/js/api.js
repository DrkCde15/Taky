const API_BASE = window.API_URL || 'http://localhost:8000';

function getAuthState() {
  try {
    const raw = localStorage.getItem('auth-storage');
    if (!raw) return null;
    return JSON.parse(raw)?.state ?? null;
  } catch { return null; }
}

function saveAuth(state) {
  localStorage.setItem('auth-storage', JSON.stringify({ state, version: 0 }));
}

async function request(method, path, body, opts = {}) {
  const state = getAuthState();
  const headers = { ...opts.headers };
  const isFormData = body instanceof FormData;
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  if (state?.token) {
    headers['Authorization'] = `Bearer ${state.token}`;
  }

  let res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
    signal: opts.signal,
  });

  if (res.status === 401 && path !== '/auth/refresh') {
    const refreshState = getAuthState();
    if (refreshState?.refreshToken) {
      try {
        const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh_token: refreshState.refreshToken }),
        });
        if (refreshRes.ok) {
          const data = await refreshRes.json();
          refreshState.token = data.access_token;
          refreshState.refreshToken = data.refresh_token;
          saveAuth(refreshState);
          headers['Authorization'] = `Bearer ${data.access_token}`;
          res = await fetch(`${API_BASE}${path}`, { method, headers, body: body ? (isFormData ? body : JSON.stringify(body)) : undefined, signal: opts.signal });
        } else {
          saveAuth({ user: null, token: null, refreshToken: null });
          window.location.hash = '#/login';
          throw new Error('Sessão expirada');
        }
      } catch (e) {
        if (e.message === 'Sessão expirada') throw e;
        saveAuth({ user: null, token: null, refreshToken: null });
        window.location.hash = '#/login';
        throw new Error('Sessão expirada');
      }
    } else {
      window.location.hash = '#/login';
      throw new Error('Não autenticado');
    }
  }

  if (!res.ok) {
    let detail;
    try { const d = await res.json(); detail = d.detail; } catch { detail = `Erro ${res.status}`; }
    const err = new Error(detail || `Erro ${res.status}`);
    err.status = res.status;
    err.response = { data: { detail } };
    throw err;
  }

  return res.json();
}

const api = {
  get: (path, opts) => request('GET', path, null, opts),
  post: (path, body, opts) => request('POST', path, body, opts),
  put: (path, body, opts) => request('PUT', path, body, opts),
  patch: (path, body, opts) => request('PATCH', path, body, opts),
  delete: (path, opts) => request('DELETE', path, null, opts),
};
