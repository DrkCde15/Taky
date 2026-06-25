import './ConfirmModal.css';

export default function ConfirmModal({ title, message, onConfirm, onCancel, confirmLabel = 'Excluir', cancelLabel = 'Cancelar' }) {
  return (
    <div className="confirm-overlay" onClick={onCancel}>
      <div className="confirm-modal glass" onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="confirm-actions">
          <button onClick={onCancel} className="btn-secondary">
            {cancelLabel}
          </button>
          <button onClick={onConfirm} className="btn-danger">
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
