const COLUMN_STYLES = {
  todo: { dot: 'bg-muted-foreground' },
  in_progress: { dot: 'bg-info' },
  blocked: { dot: 'bg-destructive' },
  done: { dot: 'bg-success' },
};

function renderColumn(id, title, tasks, members, onTaskClick, onDrop) {
  const tone = COLUMN_STYLES[id] || COLUMN_STYLES.todo;

  const col = document.createElement('div');
  col.className = 'glass flex h-[calc(100vh-180px)] w-[300px] shrink-0 flex-col gap-3 rounded-2xl p-4 sm:w-[320px]';
  col.dataset.columnId = id;

  col.addEventListener('dragover', (e) => {
    e.preventDefault();
    col.classList.add('ring-2', 'ring-primary/50', 'bg-primary/[0.04]');
  });
  col.addEventListener('dragleave', () => {
    col.classList.remove('ring-2', 'ring-primary/50', 'bg-primary/[0.04]');
  });
  col.addEventListener('drop', (e) => {
    e.preventDefault();
    col.classList.remove('ring-2', 'ring-primary/50', 'bg-primary/[0.04]');
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) onDrop(taskId, id);
  });

  col.innerHTML = `
    <div class="flex items-center justify-between px-1">
      <div class="flex items-center gap-2">
        <span class="h-2 w-2 rounded-full ${tone.dot} shadow-[0_0_8px_currentColor]"></span>
        <h3 class="text-xs font-bold uppercase tracking-wider">${title}</h3>
      </div>
      <span class="rounded-full bg-surface-3 px-2 py-0.5 text-xs font-semibold text-muted-foreground">${tasks.length}</span>
    </div>
    <div class="flex flex-1 flex-col gap-2 overflow-y-auto pr-1" id="col-tasks-${id}">
      ${tasks.length === 0 ? '<div class="grid flex-1 place-items-center rounded-xl border border-dashed border-border/60 text-xs text-muted-foreground">Solte tarefas aqui</div>' : ''}
    </div>
  `;

  const taskContainer = col.querySelector(`#col-tasks-${id}`);
  if (tasks.length > 0) {
    taskContainer.innerHTML = '';
    tasks.forEach(t => {
      taskContainer.appendChild(renderTaskCard(t, members, onTaskClick));
    });
  }

  return col;
}
