import { type ReactNode } from "react";

interface Props {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  icon?: ReactNode;
}

export default function ConfirmModal({
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = "Excluir",
  cancelLabel = "Cancelar",
  icon,
}: Props) {
  return (
    <div
      className="fixed inset-0 z-[1500] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in"
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="glass-strong w-full max-w-md rounded-2xl p-8 text-center animate-in zoom-in-95"
      >
        {icon && <div className="mb-4 flex justify-center">{icon}</div>}
        <h3 className="text-xl font-bold tracking-tight">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{message}</p>
        <div className="mt-6 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-surface-3"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-lg border border-destructive/40 bg-destructive/15 px-4 py-2.5 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/25"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
