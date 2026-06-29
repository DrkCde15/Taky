function renderLogin(app) {
  if (store.get().token) { router.navigate('/'); return; }

  app.innerHTML = `
    <div class="relative grid min-h-screen lg:grid-cols-2">
      <div class="relative hidden overflow-hidden lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div class="absolute inset-0 -z-10 bg-[image:var(--gradient-primary)] opacity-90"></div>
        <div class="absolute inset-0 -z-10 opacity-30" style="background-image: radial-gradient(circle_at_25%_25%,white_2px,transparent_2px); background-size: 24px 24px;"></div>
        <div class="flex items-center gap-3 text-primary-foreground">
          <div class="grid h-10 w-10 place-items-center rounded-xl bg-white/15 backdrop-blur">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
          </div>
          <span class="text-xl font-black tracking-tight">Taky</span>
        </div>
        <div class="text-primary-foreground">
          <h2 class="text-4xl font-black leading-tight tracking-tight">Organize o caos.<br />Entregue com clareza.</h2>
          <p class="mt-4 max-w-md text-base text-primary-foreground/85">Quadros Kanban inteligentes, calendário compartilhado e analytics em tempo real para times que constroem juntos.</p>
        </div>
        <div class="text-xs text-primary-foreground/70">© Taky — todos os direitos reservados.</div>
      </div>
      <div class="flex items-center justify-center p-6 sm:p-12">
        <div class="w-full max-w-md">
          <div class="mb-6 flex items-center gap-2 lg:hidden">
            <div class="grid h-9 w-9 place-items-center rounded-xl bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--glow-primary)]">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
            </div>
            <span class="text-lg font-bold tracking-tight">Taky</span>
          </div>
          <h1 class="text-3xl font-black tracking-tight">Acesse sua conta</h1>
          <p class="mt-2 text-sm text-muted-foreground">Continue de onde parou.</p>
          <p id="login-error" class="mt-3 text-sm font-medium text-destructive hidden"></p>
          <form id="login-form" class="mt-8 space-y-4">
            <label class="block"><span class="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">E-mail</span><div class="flex items-center gap-2 rounded-xl border border-border bg-surface-1 px-3 py-2.5 transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"><span class="text-muted-foreground"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg></span><input type="email" id="login-email" required placeholder="voce@exemplo.com" class="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/60" /></div></label>
            <label class="block"><span class="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Senha</span><div class="flex items-center gap-2 rounded-xl border border-border bg-surface-1 px-3 py-2.5 transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"><span class="text-muted-foreground"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></span><input type="password" id="login-password" required placeholder="••••••••" class="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/60" /><button type="button" id="toggle-pass" class="text-muted-foreground hover:text-foreground"><svg id="eye-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg></button></div></label>
            <button type="submit" id="login-btn" class="group flex w-full items-center justify-center gap-2 rounded-xl bg-[image:var(--gradient-primary)] px-4 py-3 text-sm font-bold text-primary-foreground shadow-[var(--glow-primary)] transition-transform hover:scale-[1.01] active:scale-95 disabled:opacity-50">Entrar <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform group-hover:translate-x-0.5"><line x1="5" x2="19" y1="12" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></button>
          </form>
          <div class="mt-8 text-center text-sm text-muted-foreground"><p>Não tem conta? <a href="#/register" class="font-semibold text-primary hover:underline">Cadastre-se</a></p></div>
        </div>
      </div>
    </div>
  `;

  let showPass = false;
  const passInput = document.getElementById('login-password');
  const toggleBtn = document.getElementById('toggle-pass');
  const eyeIcon = document.getElementById('eye-icon');
  toggleBtn.addEventListener('click', () => {
    showPass = !showPass;
    passInput.type = showPass ? 'text' : 'password';
    eyeIcon.innerHTML = showPass
      ? '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" x2="23" y1="1" y2="23"/><path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/>'
      : '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>';
  });

  const form = document.getElementById('login-form');
  const btn = document.getElementById('login-btn');
  const err = document.getElementById('login-error');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    btn.disabled = true;
    btn.textContent = 'Entrando...';
    err.classList.add('hidden');
    try {
      await store.login(document.getElementById('login-email').value, document.getElementById('login-password').value);
      toast.success('Bem-vindo de volta!');
      router.navigate('/');
    } catch (e) {
      err.textContent = typeof e === 'string' ? e : (e.message || 'Falha ao entrar');
      err.classList.remove('hidden');
      btn.disabled = false;
      btn.textContent = 'Entrar';
    }
  });
}
