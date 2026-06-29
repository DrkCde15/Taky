function renderNotificationBell(container) {
  const wrapper = document.createElement('div');
  wrapper.className = 'relative';
  wrapper.id = 'notification-bell-wrapper';
  container.appendChild(wrapper);

  let open = false;
  let now = Date.now();

  function render() {
    const s = store.get();
    wrapper.innerHTML = `
      <button id="notif-trigger" class="relative grid h-9 w-9 place-items-center rounded-lg text-muted-foreground hover:bg-white/5 hover:text-foreground" title="Notificações">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
        ${s.unreadCount > 0 ? `<span class="absolute right-1 top-1 grid h-4 min-w-[16px] place-items-center rounded-full bg-destructive px-1 text-[10px] font-bold leading-none text-destructive-foreground">${s.unreadCount > 9 ? '9+' : s.unreadCount}</span>` : ''}
      </button>
      ${open ? renderDropdown(s) : ''}
    `;

    wrapper.querySelector('#notif-trigger')?.addEventListener('click', (e) => {
      e.stopPropagation();
      open = !open;
      if (open) store.fetchNotifications();
      render();
    });

    if (open) {
      const dropdown = wrapper.querySelector('#notif-dropdown');
      if (dropdown) {
        const handler = (e) => {
          if (!wrapper.contains(e.target)) {
            open = false;
            render();
            document.removeEventListener('mousedown', handler);
          }
        };
        setTimeout(() => document.addEventListener('mousedown', handler), 0);
      }
    }
  }

  function renderDropdown(s) {
    const typeIcons = { task_assigned: '📋', status_changed: '🔄', new_comment: '💬', member_removed: '🚫' };
    function since(dateStr) {
      const diff = now - new Date(dateStr).getTime();
      const mins = Math.floor(diff / 60000);
      if (mins < 1) return 'agora';
      if (mins < 60) return `${mins}min`;
      const hours = Math.floor(mins / 60);
      if (hours < 24) return `${hours}h`;
      return `${Math.floor(hours / 24)}d`;
    }
    return `
      <div id="notif-dropdown" class="glass-strong absolute right-0 top-[calc(100%+8px)] z-50 flex w-[360px] max-w-[calc(100vw-1.5rem)] flex-col overflow-hidden rounded-xl">
        <div class="flex items-center justify-between border-b border-border px-4 py-3">
          <h4 class="text-sm font-semibold">Notificações</h4>
          ${s.unreadCount > 0 ? `<button id="mark-all-read" class="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-primary hover:bg-primary/10"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 7 17l-5-5"/><path d="m22 10-7.5 7.5L13 16"/></svg> Marcar tudo</button>` : ''}
        </div>
        <div class="max-h-[400px] overflow-y-auto">
          ${s.notifications.length === 0
            ? '<div class="px-4 py-12 text-center text-sm text-muted-foreground">Nenhuma notificação</div>'
            : s.notifications.map(n => `
              <button onclick="(async function(){if(!${n.read})await store.markAsRead(${n.id});${n.task_id ? "router.navigate('/')" : ''};this.closest('#notif-dropdown')?.parentElement?.querySelector('#notif-trigger')?.click()})()" class="flex w-full items-start gap-3 border-b border-border/50 px-4 py-3 text-left transition-colors hover:bg-white/5 ${n.read ? '' : 'border-l-2 border-l-primary bg-primary/5'}">
                <span class="text-lg leading-none">${typeIcons[n.type] || '🔔'}</span>
                <div class="min-w-0 flex-1">
                  <p class="break-words text-sm leading-snug">${escHtml(n.message)}</p>
                  <span class="mt-1 block text-xs text-muted-foreground">${since(n.created_at)}</span>
                </div>
              </button>
            `).join('')}
        </div>
      </div>
    `;
  }

  let unsub1 = store.on('unreadCount', render);
  let unsub2 = store.on('notifications', render);

  store.fetchUnreadCount();
  const i1 = setInterval(() => store.fetchUnreadCount(), 15000);
  const i2 = setInterval(() => { now = Date.now(); render(); }, 60000);

  render();

  return () => {
    clearInterval(i1);
    clearInterval(i2);
    unsub1(); unsub2();
  };
}

function escHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
