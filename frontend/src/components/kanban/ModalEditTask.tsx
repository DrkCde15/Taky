import { useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  X,
  Tag,
  MessageSquare,
  History as HistoryIcon,
  FileText,
  Upload,
  Trash2,
  Paperclip,
  Send,
} from "lucide-react";
import { useTaskStore, type Member, type Task } from "@/stores/useTaskStore";
import ConfirmModal from "@/components/ConfirmModal";

const STATUSES = [
  { id: "todo", label: "A Fazer" },
  { id: "in_progress", label: "Em Andamento" },
  { id: "blocked", label: "Bloqueado" },
  { id: "done", label: "Concluído" },
] as const;

const PRIORITIES = [
  { id: "low", label: "Baixa" },
  { id: "medium", label: "Média" },
  { id: "high", label: "Alta" },
] as const;

interface Props {
  task: Task;
  members: Member[];
  onClose: () => void;
}

export default function ModalEditTask({ task, members, onClose }: Props) {
  const { updateTask, deleteTask, addComment, uploadFile } = useTaskStore();

  const [activeTab, setActiveTab] = useState<"details" | "comments" | "history" | "files">(
    "details"
  );
  const [edited, setEdited] = useState<Task>({ ...task });
  const [commentInput, setCommentInput] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [showDelete, setShowDelete] = useState(false);

  const TABS = [
    { id: "details", label: "Detalhes", icon: FileText, count: 0 },
    { id: "comments", label: "Comentários", icon: MessageSquare, count: task.comments?.length ?? 0 },
    { id: "history", label: "Histórico", icon: HistoryIcon, count: 0 },
    { id: "files", label: "Arquivos", icon: Paperclip, count: task.files?.length ?? 0 },
  ] as const;

  const handleUpdate = <K extends keyof Task>(field: K, value: Task[K]) => {
    const next = { ...edited, [field]: value };
    setEdited(next);
    updateTask(task.id, { [field]: value } as Partial<Task>);
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const newTags = [...(edited.tags ?? []), tagInput.trim()];
      handleUpdate("tags", newTags);
      setTagInput("");
    }
  };

  const handleAddComment = () => {
    if (!commentInput.trim()) return;
    addComment(task.id, commentInput);
    setCommentInput("");
    toast.success("Comentário adicionado");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      uploadFile(task.id, f);
      toast.success("Arquivo enviado");
    }
  };

  const handleDelete = () => {
    deleteTask(task.id);
    setShowDelete(false);
    onClose();
    toast.success("Tarefa removida");
  };

  return (
    <>
      <div
        className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 p-3 backdrop-blur-md animate-in fade-in sm:p-6"
        onClick={onClose}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="glass-strong flex h-[92vh] max-h-[780px] w-full max-w-4xl flex-col overflow-hidden rounded-2xl animate-in zoom-in-95"
        >
          {/* Header */}
          <div className="flex shrink-0 items-center justify-between border-b border-border px-5 py-4 sm:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <span className="font-mono text-sm font-bold text-muted-foreground">
                #{task.id}
              </span>
              <span className="h-4 w-px bg-border" />
              <select
                value={edited.status}
                onChange={(e) => handleUpdate("status", e.target.value as Task["status"])}
                className="bg-transparent text-sm font-bold text-primary outline-none"
              >
                {STATUSES.map((s) => (
                  <option key={s.id} value={s.id} className="bg-surface-2">
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowDelete(true)}
                className="grid h-9 w-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive"
                title="Excluir"
              >
                <Trash2 size={18} />
              </button>
              <button
                onClick={onClose}
                className="grid h-9 w-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-8">
              {/* Tabs */}
              <div className="mb-6 flex gap-1 overflow-x-auto border-b border-border">
                {TABS.map((t) => {
                  const Icon = t.icon;
                  const active = activeTab === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setActiveTab(t.id)}
                      className={`flex shrink-0 items-center gap-2 border-b-2 px-3 py-2.5 text-sm font-semibold transition-colors ${
                        active
                          ? "border-primary text-foreground"
                          : "border-transparent text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Icon size={16} />
                      {t.label}
                      {t.count > 0 && (
                        <span className="rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] font-bold">
                          {t.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {activeTab === "details" && (
                <div className="space-y-6">
                  <input
                    value={edited.title}
                    onChange={(e) => handleUpdate("title", e.target.value)}
                    placeholder="Título da tarefa"
                    className="w-full border-none bg-transparent text-3xl font-bold tracking-tight text-foreground outline-none placeholder:text-muted-foreground/50"
                  />

                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      Descrição
                    </label>
                    <textarea
                      value={edited.description}
                      onChange={(e) => handleUpdate("description", e.target.value)}
                      placeholder="Descreva esta tarefa..."
                      rows={5}
                      className="mt-2 w-full resize-none rounded-lg border border-border bg-surface-1 p-3 text-sm outline-none transition-colors focus:border-primary"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {edited.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
                      >
                        <Tag size={10} />
                        {tag}
                        <button
                          onClick={() =>
                            handleUpdate(
                              "tags",
                              edited.tags.filter((t) => t !== tag)
                            )
                          }
                          className="rounded p-0.5 hover:bg-primary/20"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                    <input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleAddTag}
                      placeholder="+ tag"
                      className="rounded-md bg-surface-1 px-2 py-1 text-xs outline-none placeholder:text-muted-foreground/60 focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
              )}

              {activeTab === "comments" && (
                <div className="space-y-5">
                  <div className="space-y-2 rounded-xl border border-border bg-surface-1 p-3">
                    <textarea
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      placeholder="Escreva um comentário..."
                      rows={3}
                      className="w-full resize-none bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
                    />
                    <button
                      onClick={handleAddComment}
                      className="ml-auto flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary-glow"
                    >
                      <Send size={14} /> Enviar
                    </button>
                  </div>

                  <div className="space-y-3">
                    {!task.comments?.length ? (
                      <div className="grid place-items-center py-12 text-center text-sm text-muted-foreground">
                        <MessageSquare size={40} className="mb-3 opacity-30" />
                        <p>Nenhum comentário ainda.</p>
                      </div>
                    ) : (
                      [...task.comments]
                        .sort(
                          (a, b) =>
                            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                        )
                        .map((c) => (
                          <div key={c.id} className="flex gap-3">
                            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                              U
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 text-xs">
                                <span className="font-semibold">Usuário #{c.user_id}</span>
                                <span className="text-muted-foreground">
                                  {format(new Date(c.created_at), "dd MMM, HH:mm")}
                                </span>
                              </div>
                              <p className="mt-1 rounded-xl rounded-tl-sm border border-border bg-surface-1 px-3 py-2 text-sm">
                                {c.content}
                              </p>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </div>
              )}

              {activeTab === "history" && (
                <div>
                  {!task.history?.length ? (
                    <div className="py-12 text-center text-sm text-muted-foreground">
                      Nenhum registro ainda.
                    </div>
                  ) : (
                    <ol className="relative border-l border-border pl-5">
                      {[...task.history]
                        .sort(
                          (a, b) =>
                            new Date(b.created_at).getTime() -
                            new Date(a.created_at).getTime()
                        )
                        .map((log) => (
                          <li key={log.id} className="mb-4">
                            <span className="absolute -left-1.5 h-3 w-3 rounded-full bg-primary ring-4 ring-background" />
                            <p className="text-sm">{log.action}</p>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(log.created_at), "dd MMM, HH:mm")}
                            </span>
                          </li>
                        ))}
                    </ol>
                  )}
                </div>
              )}

              {activeTab === "files" && (
                <div className="space-y-4">
                  <label
                    htmlFor="task-file-upload"
                    className="grid cursor-pointer place-items-center rounded-xl border-2 border-dashed border-border bg-surface-1 px-6 py-10 text-center transition-colors hover:border-primary/50 hover:bg-primary/5"
                  >
                    <Upload size={32} className="mb-3 text-muted-foreground" />
                    <p className="text-sm font-semibold">
                      Arraste arquivos ou clique para enviar
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      PDF, XLSX, JSON, DOCX até 10MB
                    </p>
                    <input
                      id="task-file-upload"
                      type="file"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>

                  <div className="grid gap-2">
                    {task.files?.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center gap-3 rounded-lg border border-border bg-surface-1 px-3 py-2.5"
                      >
                        <Paperclip size={16} className="text-muted-foreground" />
                        <span className="flex-1 truncate text-sm">{file.filename}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="hidden w-64 shrink-0 border-l border-border bg-surface-1/40 p-5 lg:block">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Propriedades
              </h4>
              <div className="mt-4 space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground">Responsável</label>
                  <select
                    value={edited.memberId}
                    onChange={(e) => handleUpdate("memberId", e.target.value)}
                    className="mt-1 w-full rounded-md border border-border bg-surface-2 px-2 py-1.5 text-sm outline-none focus:border-primary"
                  >
                    {members.map((m) => (
                      <option key={m.id} value={String(m.id)} className="bg-surface-2">
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground">Prioridade</label>
                  <select
                    value={edited.priority}
                    onChange={(e) => handleUpdate("priority", e.target.value as Task["priority"])}
                    className="mt-1 w-full rounded-md border border-border bg-surface-2 px-2 py-1.5 text-sm outline-none focus:border-primary"
                  >
                    {PRIORITIES.map((p) => (
                      <option key={p.id} value={p.id} className="bg-surface-2">
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground">Tempo gasto (h)</label>
                  <input
                    type="number"
                    min={0}
                    step={0.5}
                    value={edited.timeSpent}
                    onChange={(e) => handleUpdate("timeSpent", parseFloat(e.target.value) || 0)}
                    className="mt-1 w-full rounded-md border border-border bg-surface-2 px-2 py-1.5 text-sm outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-xs text-muted-foreground">Prazo</label>
                  <input
                    type="date"
                    value={edited.dueDate ? edited.dueDate.slice(0, 10) : ""}
                    onChange={(e) => handleUpdate("dueDate", e.target.value)}
                    className="mt-1 w-full rounded-md border border-border bg-surface-2 px-2 py-1.5 text-sm outline-none focus:border-primary"
                  />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {showDelete && (
        <ConfirmModal
          title="Excluir tarefa?"
          message="Esta ação não pode ser desfeita."
          onConfirm={handleDelete}
          onCancel={() => setShowDelete(false)}
        />
      )}
    </>
  );
}
