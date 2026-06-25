import { useDraggable } from "@dnd-kit/core";
import { Clock, MessageSquare, Paperclip } from "lucide-react";
import type { Member, Task } from "@/stores/useTaskStore";

const PRIORITY_CLASSES: Record<string, string> = {
  high: "bg-destructive/15 text-destructive border-destructive/30",
  medium: "bg-warning/15 text-warning border-warning/30",
  low: "bg-success/15 text-success border-success/30",
};

interface Props {
  task: Task;
  onClick: (t: Task) => void;
  member?: Member;
}

export default function TaskCard({ task, onClick, member }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: { type: "Task", task },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.4 : 1,
        zIndex: isDragging ? 100 : 1,
      }
    : undefined;

  const prio = PRIORITY_CLASSES[task.priority] ?? PRIORITY_CLASSES.medium;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={() => onClick(task)}
      style={style}
      className={`group glass cursor-grab rounded-xl p-3.5 transition-all hover:border-primary/40 hover:shadow-[0_0_0_1px_var(--color-primary)/30,0_8px_24px_-8px_var(--color-primary)/40] active:cursor-grabbing ${
        isDragging ? "ring-2 ring-primary" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <span
          className={`rounded-md border px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${prio}`}
        >
          {task.priority}
        </span>
        <span className="text-[10px] font-mono text-muted-foreground">#{task.id}</span>
      </div>

      {task.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {task.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded border border-border bg-surface-1 px-1.5 py-0.5 text-[10px] text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <h4 className="mt-2 text-sm font-semibold leading-snug text-foreground">
        {task.title}
      </h4>
      {task.description && (
        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
          {task.description}
        </p>
      )}

      <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-2.5">
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Clock size={12} />
            {task.timeSpent}h
          </span>
          {task.comments.length > 0 && (
            <span className="inline-flex items-center gap-1">
              <MessageSquare size={12} />
              {task.comments.length}
            </span>
          )}
          {task.files.length > 0 && (
            <span className="inline-flex items-center gap-1">
              <Paperclip size={12} />
              {task.files.length}
            </span>
          )}
        </div>

        {member && (
          <div
            title={member.name}
            className="grid h-6 w-6 place-items-center rounded-full border border-border bg-primary/20 text-[10px] font-bold text-primary"
          >
            {member.avatar ? (
              <img
                src={member.avatar}
                alt={member.name}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              member.name?.[0]?.toUpperCase() ?? "?"
            )}
          </div>
        )}
      </div>
    </div>
  );
}
