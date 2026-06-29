const router = (() => {
  const routes = {};
  let currentCleanup = null;

  function route(path, renderFn) {
    routes[path] = renderFn;
  }

  function navigate(path) {
    window.location.hash = '#' + path;
  }

  function getPath() {
    return window.location.hash.slice(1) || '/home';
  }

  async function resolve() {
    if (currentCleanup && typeof currentCleanup === 'function') {
      currentCleanup();
      currentCleanup = null;
    }

    const path = getPath();
    const app = document.getElementById('app');

    const exactMatch = routes[path];
    if (exactMatch) {
      app.innerHTML = '';
      const result = exactMatch(app);
      if (result && typeof result === 'function') currentCleanup = result;
      return;
    }

    app.innerHTML = `<div class="flex items-center justify-center min-h-screen"><div class="text-center glass rounded-2xl p-8 max-w-md"><h1 class="text-4xl font-black">404</h1><p class="mt-2 text-muted-foreground">Página não encontrada.</p><a href="#/home" class="mt-4 inline-block text-primary font-semibold hover:underline">Voltar ao início</a></div></div>`;
  }

  function init() {
    window.addEventListener('hashchange', resolve);
    resolve();
  }

  return { route, navigate, resolve, init, getPath };
})();
