import { useDroppable } from "@dnd-kit/core";
import TaskCard from "./TaskCard";
import type { Member, Task } from "@/stores/useTaskStore";

const COLUMN_STYLES: Record<string, { dot: string; ring: string }> = {
  todo: { dot: "bg-muted-foreground", ring: "ring-muted-foreground/30" },
  in_progress: { dot: "bg-info", ring: "ring-info/30" },
  blocked: { dot: "bg-destructive", ring: "ring-destructive/30" },
  done: { dot: "bg-success", ring: "ring-success/30" },
};

interface Props {
  id: string;
  title: string;
  tasks: Task[];
  members: Member[];
  onTaskClick: (t: Task) => void;
}

export default function Column({ id, title, tasks, members, onTaskClick }: Props) {
  const { isOver, setNodeRef } = useDroppable({ id });
  const tone = COLUMN_STYLES[id] ?? COLUMN_STYLES.todo;

  const memberById = (mid: string) => members.find((m) => String(m.id) === mid);

  return (
    <div
      ref={setNodeRef}
      className={`glass flex h-[calc(100vh-180px)] w-[300px] shrink-0 flex-col gap-3 rounded-2xl p-4 transition-colors sm:w-[320px] ${
        isOver ? "ring-2 ring-primary/50 bg-primary/[0.04]" : ""
      }`}
    >
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${tone.dot} shadow-[0_0_8px_currentColor]`} />
          <h3 className="text-xs font-bold uppercase tracking-wider text-foreground">
            {title}
          </h3>
        </div>
        <span className="rounded-full bg-surface-3 px-2 py-0.5 text-xs font-semibold text-muted-foreground">
          {tasks.length}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 overflow-y-auto pr-1">
        {tasks.length === 0 ? (
          <div className="grid flex-1 place-items-center rounded-xl border border-dashed border-border/60 text-xs text-muted-foreground">
            Solte tarefas aqui
          </div>
        ) : (
          tasks.map((t) => (
            <TaskCard
              key={t.id}
              task={t}
              onClick={onTaskClick}
              member={memberById(t.memberId)}
            />
          ))
        )}
      </div>
    </div>
  );
}
