function openModal(html) {
  const existing = document.querySelector('.custom-modal-overlay');
  if (existing) existing.remove();
  const overlay = document.createElement('div');
  overlay.className = 'custom-modal-overlay fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md animate-in fade-in';
  overlay.innerHTML = html;
  document.body.appendChild(overlay);
  return overlay;
}

function closeModal(overlay) {
  if (overlay) overlay.remove();
}
