function showConfirmModal(title, message, onConfirm, options = {}) {
  const { confirmLabel = 'Excluir', cancelLabel = 'Cancelar', iconHtml = '' } = options;
  const overlay = openModal(`
    <div onclick="event.stopPropagation()" class="glass-strong w-full max-w-md rounded-2xl p-8 text-center animate-in zoom-in-95">
      ${iconHtml ? `<div class="mb-4 flex justify-center">${iconHtml}</div>` : ''}
      <h3 class="text-xl font-bold tracking-tight">${title}</h3>
      <p class="mt-2 text-sm text-muted-foreground">${message}</p>
      <div class="mt-6 flex gap-3">
        <button onclick="this.closest('.custom-modal-overlay').remove()" class="flex-1 rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm font-semibold hover:bg-surface-3">${cancelLabel}</button>
        <button id="confirm-btn" class="flex-1 rounded-lg border border-destructive/40 bg-destructive/15 px-4 py-2.5 text-sm font-semibold text-destructive hover:bg-destructive/25">${confirmLabel}</button>
      </div>
    </div>
  `);
  overlay.querySelector('#confirm-btn').onclick = () => { onConfirm(); overlay.remove(); };
  overlay.onclick = () => overlay.remove();
}
