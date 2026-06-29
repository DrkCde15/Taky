function renderModalEditTask(task, members, onClose) {
  const STATUSES = [
    { id: 'todo', label: 'A Fazer' },
    { id: 'in_progress', label: 'Em Andamento' },
    { id: 'blocked', label: 'Bloqueado' },
    { id: 'done', label: 'Concluído' },
  ];
  const PRIORITIES = [
    { id: 'low', label: 'Baixa' },
    { id: 'medium', label: 'Média' },
    { id: 'high', label: 'Alta' },
  ];

  let edited = { ...task };
  let activeTab = 'details';
  let commentInput = '';
  let tagInput = '';
  let showDelete = false;

  function render() {
    const TABS = [
      { id: 'details', label: 'Detalhes', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>` },
      { id: 'comments', label: 'Comentários', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>` },
      { id: 'history', label: 'Histórico', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>` },
      { id: 'files', label: 'Arquivos', icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>` },
    ];

    return `
      <div onclick="event.stopPropagation()" class="glass-strong flex h-[92vh] max-h-[780px] w-full max-w-4xl flex-col overflow-hidden rounded-2xl animate-in zoom-in-95">
        <div class="flex shrink-0 items-center justify-between border-b border-border px-5 py-4 sm:px-8">
          <div class="flex min-w-0 items-center gap-3">
            <span class="font-mono text-sm font-bold text-muted-foreground">#${task.id}</span>
            <span class="h-4 w-px bg-border"></span>
            <select id="edit-status" class="bg-transparent text-sm font-bold text-primary outline-none">
              ${STATUSES.map(s => `<option value="${s.id}" ${edited.status === s.id ? 'selected' : ''} class="bg-surface-2">${s.label}</option>`).join('')}
            </select>
          </div>
          <div class="flex items-center gap-1">
            <button id="delete-task-btn" class="grid h-9 w-9 place-items-center rounded-lg text-muted-foreground hover:bg-destructive/15 hover:text-destructive" title="Excluir">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
            </button>
            <button id="close-edit-modal" class="grid h-9 w-9 place-items-center rounded-lg text-muted-foreground hover:bg-white/5 hover:text-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
            </button>
          </div>
        </div>
        <div class="flex flex-1 overflow-hidden">
          <div class="flex-1 overflow-y-auto px-5 py-6 sm:px-8">
            <div class="mb-6 flex gap-1 overflow-x-auto border-b border-border">
              ${TABS.map(t => `
                <button onclick="(function(){activeTab='${t.id}';renderContent()})()" class="flex shrink-0 items-center gap-2 border-b-2 px-3 py-2.5 text-sm font-semibold transition-colors ${activeTab === t.id ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}">
                  ${t.icon} ${t.label}
                </button>
              `).join('')}
            </div>
            <div id="edit-tab-content">${renderTabContent()}</div>
          </div>
          <aside class="hidden w-64 shrink-0 border-l border-border bg-surface-1/40 p-5 lg:block">
            <h4 class="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Propriedades</h4>
            <div class="mt-4 space-y-4">
              <div><label class="text-xs text-muted-foreground">Responsável</label><select id="edit-member" class="mt-1 w-full rounded-md border border-border bg-surface-2 px-2 py-1.5 text-sm outline-none focus:border-primary">${members.map(m => `<option value="${m.id}" ${edited.memberId === String(m.id) ? 'selected' : ''} class="bg-surface-2">${escHtml(m.name)}</option>`).join('')}</select></div>
              <div><label class="text-xs text-muted-foreground">Prioridade</label><select id="edit-priority" class="mt-1 w-full rounded-md border border-border bg-surface-2 px-2 py-1.5 text-sm outline-none focus:border-primary">${PRIORITIES.map(p => `<option value="${p.id}" ${edited.priority === p.id ? 'selected' : ''} class="bg-surface-2">${p.label}</option>`).join('')}</select></div>
              <div><label class="text-xs text-muted-foreground">Tempo gasto (h)</label><input type="number" id="edit-time" min="0" step="0.5" value="${edited.timeSpent}" class="mt-1 w-full rounded-md border border-border bg-surface-2 px-2 py-1.5 text-sm outline-none focus:border-primary" /></div>
              <div><label class="text-xs text-muted-foreground">Prazo</label><input type="date" id="edit-due" value="${edited.dueDate ? edited.dueDate.slice(0, 10) : ''}" class="mt-1 w-full rounded-md border border-border bg-surface-2 px-2 py-1.5 text-sm outline-none focus:border-primary" /></div>
            </div>
          </aside>
        </div>
      </div>
    `;
  }

  function renderTabContent() {
    if (activeTab === 'details') {
      return `
        <div class="space-y-6">
          <input id="edit-title" value="${escHtml(edited.title)}" placeholder="Título da tarefa" class="w-full border-none bg-transparent text-3xl font-bold tracking-tight outline-none placeholder:text-muted-foreground/50" />
          <div><label class="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Descrição</label><textarea id="edit-desc" rows="6" class="mt-2 w-full rounded-xl border border-border bg-surface-1 px-4 py-3 text-sm outline-none focus:border-primary">${escHtml(edited.description)}</textarea></div>
          <div class="flex flex-wrap items-center gap-2" id="tags-container">
            ${(edited.tags || []).map(tag => `<span class="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><path d="M7 7h.01"/></svg>${escHtml(tag)} <button onclick="(function(){edited.tags = edited.tags.filter(t=>t!=='${escHtml(tag)}');renderContent()})()" class="rounded p-0.5 hover:bg-primary/20"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg></button></span>`).join('')}
            <input id="tag-input" placeholder="+ tag" class="rounded-md bg-surface-1 px-2 py-1 text-xs outline-none placeholder:text-muted-foreground/60 focus:ring-1 focus:ring-primary" />
          </div>
        </div>
      `;
    }
    if (activeTab === 'comments') {
      const comments = [...(task.comments || [])].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      return `
        <div class="space-y-5">
          <div class="space-y-2 rounded-xl border border-border bg-surface-1 p-3">
            <textarea id="comment-input" rows="3" placeholder="Escreva um comentário..." class="w-full resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"></textarea>
            <button id="send-comment" class="ml-auto flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:opacity-90">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" x2="11" y1="2" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Enviar
            </button>
          </div>
          <div class="space-y-3">
            ${comments.length === 0 ? '<div class="grid place-items-center py-12 text-center text-sm text-muted-foreground"><svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mb-3 opacity-30"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg><p>Nenhum comentário ainda.</p></div>' : comments.map(c => `
              <div class="flex gap-3">
                <div class="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/15 text-xs font-bold text-primary">U</div>
                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-2 text-xs"><span class="font-semibold">Usuário #${c.user_id}</span><span class="text-muted-foreground">${new Date(c.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span></div>
                  <div class="mt-1 rounded-xl rounded-tl-sm border border-border bg-surface-1 px-3 py-2 text-sm">${escHtml(c.content)}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }
    if (activeTab === 'history') {
      const history = [...(task.history || [])].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      return history.length === 0
        ? '<div class="py-12 text-center text-sm text-muted-foreground">Nenhum registro ainda.</div>'
        : `<ol class="relative border-l border-border pl-5">${history.map(log => `
          <li class="mb-4"><span class="absolute -left-1.5 h-3 w-3 rounded-full bg-primary ring-4 ring-background"></span><p class="text-sm">${escHtml(log.action)}</p><span class="text-xs text-muted-foreground">${new Date(log.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span></li>
        `).join('')}</ol>`;
    }
    if (activeTab === 'files') {
      return `
        <div class="space-y-4">
          <label class="grid cursor-pointer place-items-center rounded-xl border-2 border-dashed border-border bg-surface-1 px-6 py-10 text-center hover:border-primary/50 hover:bg-primary/5">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mb-3 text-muted-foreground"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
            <p class="text-sm font-semibold">Arraste arquivos ou clique para enviar</p>
            <p class="mt-1 text-xs text-muted-foreground">PDF, XLSX, JSON, DOCX até 10MB</p>
            <input id="file-upload" type="file" class="hidden" />
          </label>
          <div class="grid gap-2">
            ${(task.files || []).map(f => `
              <div class="flex items-center gap-3 rounded-lg border border-border bg-surface-1 px-3 py-2.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-muted-foreground"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
                <span class="flex-1 truncate text-sm">${escHtml(f.filename)}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }
    return '';
  }

  async function handleFieldUpdate(field, value) {
    edited = { ...edited, [field]: value };
    await store.updateTask(task.id, { [field]: value });
  }

  const overlay = openModal(render());
  
  overlay.querySelector('#close-edit-modal')?.addEventListener('click', () => { overlay.remove(); onClose?.(); });
  overlay.querySelector('#delete-task-btn')?.addEventListener('click', () => {
    showConfirmModal('Excluir tarefa?', 'Esta ação não pode ser desfeita.', async () => {
      await store.deleteTask(task.id);
      overlay.remove();
      onClose?.();
      toast.success('Tarefa removida');
    });
  });

  function bindEvents() {
    const titleEl = overlay.querySelector('#edit-title');
    if (titleEl) titleEl.addEventListener('change', () => handleFieldUpdate('title', titleEl.value));
    const descEl = overlay.querySelector('#edit-desc');
    if (descEl) descEl.addEventListener('change', () => handleFieldUpdate('description', descEl.value));
    const statusEl = overlay.querySelector('#edit-status');
    if (statusEl) statusEl.addEventListener('change', () => handleFieldUpdate('status', statusEl.value));
    const memberEl = overlay.querySelector('#edit-member');
    if (memberEl) memberEl.addEventListener('change', () => handleFieldUpdate('memberId', memberEl.value));
    const priorityEl = overlay.querySelector('#edit-priority');
    if (priorityEl) priorityEl.addEventListener('change', () => handleFieldUpdate('priority', priorityEl.value));
    const timeEl = overlay.querySelector('#edit-time');
    if (timeEl) timeEl.addEventListener('change', () => handleFieldUpdate('timeSpent', parseFloat(timeEl.value) || 0));
    const dueEl = overlay.querySelector('#edit-due');
    if (dueEl) dueEl.addEventListener('change', () => handleFieldUpdate('dueDate', dueEl.value));

    const tagInputEl = overlay.querySelector('#tag-input');
    if (tagInputEl) tagInputEl.addEventListener('keydown', async (e) => {
      if (e.key === 'Enter' && tagInputEl.value.trim()) {
        e.preventDefault();
        const newTags = [...(edited.tags || []), tagInputEl.value.trim()];
        edited.tags = newTags;
        await handleFieldUpdate('tags', newTags);
        tagInputEl.value = '';
        const tc = overlay.querySelector('#tags-container');
        if (tc) tc.outerHTML = renderContentMatch('tags-container');
      }
    });

    const commentBtn = overlay.querySelector('#send-comment');
    const commentInputEl = overlay.querySelector('#comment-input');
    if (commentBtn && commentInputEl) {
      const sendComment = async () => {
        if (!commentInputEl.value.trim()) return;
        await store.addComment(task.id, commentInputEl.value.trim());
        commentInputEl.value = '';
        toast.success('Comentário adicionado');
        await store.fetchTasks(store.get().activeProjectId);
        const newTask = store.get().tasks.find(t => t.id === task.id);
        if (newTask) { edited.comments = newTask.comments; task.comments = newTask.comments; }
      };
      commentBtn.addEventListener('click', sendComment);
      commentInputEl.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendComment(); } });
    }

    const fileInput = overlay.querySelector('#file-upload');
    if (fileInput) fileInput.addEventListener('change', async (e) => {
      const f = e.target.files?.[0];
      if (f) { await store.uploadFile(task.id, f); toast.success('Arquivo enviado'); }
    });
  }

  function renderContentMatch(id) {
    if (id === 'tags-container') {
      return `<div id="tags-container" class="flex flex-wrap items-center gap-2">${(edited.tags || []).map(tag => `<span class="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><path d="M7 7h.01"/></svg>${escHtml(tag)} <button onclick="(function(){edited.tags = edited.tags.filter(t=>t!=='${escHtml(tag)}');const tc=document.getElementById('tags-container');tc.parentNode.replaceChild(renderContentMatch('tags-container').firstElementChild,tc);handleFieldUpdate('tags',edited.tags)})()" class="rounded p-0.5 hover:bg-primary/20"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg></button></span>`).join('')}<input id="tag-input" placeholder="+ tag" class="rounded-md bg-surface-1 px-2 py-1 text-xs outline-none placeholder:text-muted-foreground/60 focus:ring-1 focus:ring-primary" /></div>`;
    }
    return '';
  }

  bindEvents();
}
