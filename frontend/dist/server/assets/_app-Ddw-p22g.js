import { r as baseURL } from "./useAuthStore-C20Kd3MZ.js";
import { n as Navbar, t as useTaskStore } from "./useTaskStore-COpBNZKZ.js";
import { t as ConfirmModal } from "./ConfirmModal-8XbNTfEe.js";
import { useEffect, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { toast } from "sonner";
import { Clock, FileText, History, MessageSquare, Paperclip, Send, Tag, Trash2, Upload, X } from "lucide-react";
import { format } from "date-fns";
import { DndContext, PointerSensor, useDraggable, useDroppable, useSensor, useSensors } from "@dnd-kit/core";
import MDEditor from "@uiw/react-md-editor";
//#region src/components/kanban/TaskCard.tsx
var PRIORITY_CLASSES = {
	high: "bg-destructive/15 text-destructive border-destructive/30",
	medium: "bg-warning/15 text-warning border-warning/30",
	low: "bg-success/15 text-success border-success/30"
};
function TaskCard({ task, onClick, member }) {
	const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
		id: task.id,
		data: {
			type: "Task",
			task
		}
	});
	const style = transform ? {
		transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
		opacity: isDragging ? .4 : 1,
		zIndex: isDragging ? 100 : 1
	} : void 0;
	const prio = PRIORITY_CLASSES[task.priority] ?? PRIORITY_CLASSES.medium;
	return /* @__PURE__ */ jsxs("div", {
		ref: setNodeRef,
		...listeners,
		...attributes,
		onClick: () => onClick(task),
		style,
		className: `group glass cursor-grab rounded-xl p-3.5 transition-all hover:border-primary/40 hover:shadow-[0_0_0_1px_var(--color-primary)/30,0_8px_24px_-8px_var(--color-primary)/40] active:cursor-grabbing ${isDragging ? "ring-2 ring-primary" : ""}`,
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-start justify-between gap-2",
				children: [/* @__PURE__ */ jsx("span", {
					className: `rounded-md border px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${prio}`,
					children: task.priority
				}), /* @__PURE__ */ jsxs("span", {
					className: "text-[10px] font-mono text-muted-foreground",
					children: ["#", task.id]
				})]
			}),
			task.tags.length > 0 && /* @__PURE__ */ jsx("div", {
				className: "mt-2 flex flex-wrap gap-1",
				children: task.tags.slice(0, 3).map((tag) => /* @__PURE__ */ jsx("span", {
					className: "rounded border border-border bg-surface-1 px-1.5 py-0.5 text-[10px] text-muted-foreground",
					children: tag
				}, tag))
			}),
			/* @__PURE__ */ jsx("h4", {
				className: "mt-2 text-sm font-semibold leading-snug text-foreground",
				children: task.title
			}),
			task.description && /* @__PURE__ */ jsx("p", {
				className: "mt-1 line-clamp-2 text-xs text-muted-foreground",
				children: task.description
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-3 flex items-center justify-between border-t border-border/60 pt-2.5",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-3 text-[11px] text-muted-foreground",
					children: [
						/* @__PURE__ */ jsxs("span", {
							className: "inline-flex items-center gap-1",
							children: [
								/* @__PURE__ */ jsx(Clock, { size: 12 }),
								task.timeSpent,
								"h"
							]
						}),
						task.comments.length > 0 && /* @__PURE__ */ jsxs("span", {
							className: "inline-flex items-center gap-1",
							children: [/* @__PURE__ */ jsx(MessageSquare, { size: 12 }), task.comments.length]
						}),
						task.files.length > 0 && /* @__PURE__ */ jsxs("span", {
							className: "inline-flex items-center gap-1",
							children: [/* @__PURE__ */ jsx(Paperclip, { size: 12 }), task.files.length]
						})
					]
				}), member && /* @__PURE__ */ jsx("div", {
					title: member.name,
					className: "grid h-6 w-6 place-items-center rounded-full border border-border bg-primary/20 text-[10px] font-bold text-primary",
					children: member.avatar ? /* @__PURE__ */ jsx("img", {
						src: member.avatar,
						alt: member.name,
						className: "h-full w-full rounded-full object-cover"
					}) : member.name?.[0]?.toUpperCase() ?? "?"
				})]
			})
		]
	});
}
//#endregion
//#region src/components/kanban/Column.tsx
var COLUMN_STYLES = {
	todo: {
		dot: "bg-muted-foreground",
		ring: "ring-muted-foreground/30"
	},
	in_progress: {
		dot: "bg-info",
		ring: "ring-info/30"
	},
	blocked: {
		dot: "bg-destructive",
		ring: "ring-destructive/30"
	},
	done: {
		dot: "bg-success",
		ring: "ring-success/30"
	}
};
function Column({ id, title, tasks, members, onTaskClick }) {
	const { isOver, setNodeRef } = useDroppable({ id });
	const tone = COLUMN_STYLES[id] ?? COLUMN_STYLES.todo;
	const memberById = (mid) => members.find((m) => String(m.id) === mid);
	return /* @__PURE__ */ jsxs("div", {
		ref: setNodeRef,
		className: `glass flex h-[calc(100vh-180px)] w-[300px] shrink-0 flex-col gap-3 rounded-2xl p-4 transition-colors sm:w-[320px] ${isOver ? "ring-2 ring-primary/50 bg-primary/[0.04]" : ""}`,
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center justify-between px-1",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ jsx("span", { className: `h-2 w-2 rounded-full ${tone.dot} shadow-[0_0_8px_currentColor]` }), /* @__PURE__ */ jsx("h3", {
					className: "text-xs font-bold uppercase tracking-wider text-foreground",
					children: title
				})]
			}), /* @__PURE__ */ jsx("span", {
				className: "rounded-full bg-surface-3 px-2 py-0.5 text-xs font-semibold text-muted-foreground",
				children: tasks.length
			})]
		}), /* @__PURE__ */ jsx("div", {
			className: "flex flex-1 flex-col gap-2 overflow-y-auto pr-1",
			children: tasks.length === 0 ? /* @__PURE__ */ jsx("div", {
				className: "grid flex-1 place-items-center rounded-xl border border-dashed border-border/60 text-xs text-muted-foreground",
				children: "Solte tarefas aqui"
			}) : tasks.map((t) => /* @__PURE__ */ jsx(TaskCard, {
				task: t,
				onClick: onTaskClick,
				member: memberById(t.memberId)
			}, t.id))
		})]
	});
}
//#endregion
//#region src/components/kanban/ModalEditTask.tsx
var STATUSES = [
	{
		id: "todo",
		label: "A Fazer"
	},
	{
		id: "in_progress",
		label: "Em Andamento"
	},
	{
		id: "blocked",
		label: "Bloqueado"
	},
	{
		id: "done",
		label: "Concluído"
	}
];
var PRIORITIES = [
	{
		id: "low",
		label: "Baixa"
	},
	{
		id: "medium",
		label: "Média"
	},
	{
		id: "high",
		label: "Alta"
	}
];
function ModalEditTask({ task, members, onClose }) {
	const { updateTask, deleteTask, addComment, uploadFile } = useTaskStore();
	const [activeTab, setActiveTab] = useState("details");
	const [edited, setEdited] = useState({ ...task });
	const [commentInput, setCommentInput] = useState("");
	const [tagInput, setTagInput] = useState("");
	const [showDelete, setShowDelete] = useState(false);
	const TABS = [
		{
			id: "details",
			label: "Detalhes",
			icon: FileText,
			count: 0
		},
		{
			id: "comments",
			label: "Comentários",
			icon: MessageSquare,
			count: task.comments?.length ?? 0
		},
		{
			id: "history",
			label: "Histórico",
			icon: History,
			count: 0
		},
		{
			id: "files",
			label: "Arquivos",
			icon: Paperclip,
			count: task.files?.length ?? 0
		}
	];
	const handleUpdate = (field, value) => {
		setEdited({
			...edited,
			[field]: value
		});
		updateTask(task.id, { [field]: value });
	};
	const handleAddTag = (e) => {
		if (e.key === "Enter" && tagInput.trim()) {
			e.preventDefault();
			handleUpdate("tags", [...edited.tags ?? [], tagInput.trim()]);
			setTagInput("");
		}
	};
	const handleAddComment = () => {
		if (!commentInput.trim()) return;
		addComment(task.id, commentInput);
		setCommentInput("");
		toast.success("Comentário adicionado");
	};
	const handleFileUpload = (e) => {
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
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("div", {
		className: "fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 p-3 backdrop-blur-md animate-in fade-in sm:p-6",
		onClick: onClose,
		children: /* @__PURE__ */ jsxs("div", {
			onClick: (e) => e.stopPropagation(),
			className: "glass-strong flex h-[92vh] max-h-[780px] w-full max-w-4xl flex-col overflow-hidden rounded-2xl animate-in zoom-in-95",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex shrink-0 items-center justify-between border-b border-border px-5 py-4 sm:px-8",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex min-w-0 items-center gap-3",
					children: [
						/* @__PURE__ */ jsxs("span", {
							className: "font-mono text-sm font-bold text-muted-foreground",
							children: ["#", task.id]
						}),
						/* @__PURE__ */ jsx("span", { className: "h-4 w-px bg-border" }),
						/* @__PURE__ */ jsx("select", {
							value: edited.status,
							onChange: (e) => handleUpdate("status", e.target.value),
							className: "bg-transparent text-sm font-bold text-primary outline-none",
							children: STATUSES.map((s) => /* @__PURE__ */ jsx("option", {
								value: s.id,
								className: "bg-surface-2",
								children: s.label
							}, s.id))
						})
					]
				}), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-1",
					children: [/* @__PURE__ */ jsx("button", {
						onClick: () => setShowDelete(true),
						className: "grid h-9 w-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/15 hover:text-destructive",
						title: "Excluir",
						children: /* @__PURE__ */ jsx(Trash2, { size: 18 })
					}), /* @__PURE__ */ jsx("button", {
						onClick: onClose,
						className: "grid h-9 w-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground",
						children: /* @__PURE__ */ jsx(X, { size: 20 })
					})]
				})]
			}), /* @__PURE__ */ jsxs("div", {
				className: "flex flex-1 overflow-hidden",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex-1 overflow-y-auto px-5 py-6 sm:px-8",
					children: [
						/* @__PURE__ */ jsx("div", {
							className: "mb-6 flex gap-1 overflow-x-auto border-b border-border",
							children: TABS.map((t) => {
								const Icon = t.icon;
								return /* @__PURE__ */ jsxs("button", {
									onClick: () => setActiveTab(t.id),
									className: `flex shrink-0 items-center gap-2 border-b-2 px-3 py-2.5 text-sm font-semibold transition-colors ${activeTab === t.id ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`,
									children: [
										/* @__PURE__ */ jsx(Icon, { size: 16 }),
										t.label,
										t.count > 0 && /* @__PURE__ */ jsx("span", {
											className: "rounded-full bg-white/10 px-1.5 py-0.5 text-[10px] font-bold",
											children: t.count
										})
									]
								}, t.id);
							})
						}),
						activeTab === "details" && /* @__PURE__ */ jsxs("div", {
							className: "space-y-6",
							children: [
								/* @__PURE__ */ jsx("input", {
									value: edited.title,
									onChange: (e) => handleUpdate("title", e.target.value),
									placeholder: "Título da tarefa",
									className: "w-full border-none bg-transparent text-3xl font-bold tracking-tight text-foreground outline-none placeholder:text-muted-foreground/50"
								}),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
									className: "text-[11px] font-bold uppercase tracking-wider text-muted-foreground",
									children: "Descrição"
								}), /* @__PURE__ */ jsx("div", {
									"data-color-mode": "dark",
									className: "mt-2",
									children: /* @__PURE__ */ jsx(MDEditor, {
										value: edited.description,
										onChange: (val) => handleUpdate("description", val || ""),
										preview: "live",
										height: 300,
										style: {
											backgroundColor: "var(--surface-1)",
											border: "1px solid var(--border)"
										}
									})
								})] }),
								/* @__PURE__ */ jsxs("div", {
									className: "flex flex-wrap items-center gap-2",
									children: [edited.tags?.map((tag) => /* @__PURE__ */ jsxs("span", {
										className: "inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary",
										children: [
											/* @__PURE__ */ jsx(Tag, { size: 10 }),
											tag,
											/* @__PURE__ */ jsx("button", {
												onClick: () => handleUpdate("tags", edited.tags.filter((t) => t !== tag)),
												className: "rounded p-0.5 hover:bg-primary/20",
												children: /* @__PURE__ */ jsx(X, { size: 12 })
											})
										]
									}, tag)), /* @__PURE__ */ jsx("input", {
										value: tagInput,
										onChange: (e) => setTagInput(e.target.value),
										onKeyDown: handleAddTag,
										placeholder: "+ tag",
										className: "rounded-md bg-surface-1 px-2 py-1 text-xs outline-none placeholder:text-muted-foreground/60 focus:ring-1 focus:ring-primary"
									})]
								})
							]
						}),
						activeTab === "comments" && /* @__PURE__ */ jsxs("div", {
							className: "space-y-5",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "space-y-2 rounded-xl border border-border bg-surface-1 p-3",
								children: [/* @__PURE__ */ jsx("div", {
									"data-color-mode": "dark",
									children: /* @__PURE__ */ jsx(MDEditor, {
										value: commentInput,
										onChange: (val) => setCommentInput(val || ""),
										preview: "edit",
										height: 120,
										style: {
											backgroundColor: "transparent",
											border: "none"
										}
									})
								}), /* @__PURE__ */ jsxs("button", {
									onClick: handleAddComment,
									className: "ml-auto flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary-glow",
									children: [/* @__PURE__ */ jsx(Send, { size: 14 }), " Enviar"]
								})]
							}), /* @__PURE__ */ jsx("div", {
								className: "space-y-3",
								children: !task.comments?.length ? /* @__PURE__ */ jsxs("div", {
									className: "grid place-items-center py-12 text-center text-sm text-muted-foreground",
									children: [/* @__PURE__ */ jsx(MessageSquare, {
										size: 40,
										className: "mb-3 opacity-30"
									}), /* @__PURE__ */ jsx("p", { children: "Nenhum comentário ainda." })]
								}) : [...task.comments].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map((c) => /* @__PURE__ */ jsxs("div", {
									className: "flex gap-3",
									children: [/* @__PURE__ */ jsx("div", {
										className: "grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/15 text-xs font-bold text-primary",
										children: "U"
									}), /* @__PURE__ */ jsxs("div", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-2 text-xs",
											children: [/* @__PURE__ */ jsxs("span", {
												className: "font-semibold",
												children: ["Usuário #", c.user_id]
											}), /* @__PURE__ */ jsx("span", {
												className: "text-muted-foreground",
												children: format(new Date(c.created_at), "dd MMM, HH:mm")
											})]
										}), /* @__PURE__ */ jsx("div", {
											"data-color-mode": "dark",
											className: "mt-1 rounded-xl rounded-tl-sm border border-border bg-surface-1 px-3 py-2 text-sm",
											children: /* @__PURE__ */ jsx(MDEditor.Markdown, {
												source: c.content,
												style: {
													backgroundColor: "transparent",
													fontSize: "14px"
												}
											})
										})]
									})]
								}, c.id))
							})]
						}),
						activeTab === "history" && /* @__PURE__ */ jsx("div", { children: !task.history?.length ? /* @__PURE__ */ jsx("div", {
							className: "py-12 text-center text-sm text-muted-foreground",
							children: "Nenhum registro ainda."
						}) : /* @__PURE__ */ jsx("ol", {
							className: "relative border-l border-border pl-5",
							children: [...task.history].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map((log) => /* @__PURE__ */ jsxs("li", {
								className: "mb-4",
								children: [
									/* @__PURE__ */ jsx("span", { className: "absolute -left-1.5 h-3 w-3 rounded-full bg-primary ring-4 ring-background" }),
									/* @__PURE__ */ jsx("p", {
										className: "text-sm",
										children: log.action
									}),
									/* @__PURE__ */ jsx("span", {
										className: "text-xs text-muted-foreground",
										children: format(new Date(log.created_at), "dd MMM, HH:mm")
									})
								]
							}, log.id))
						}) }),
						activeTab === "files" && /* @__PURE__ */ jsxs("div", {
							className: "space-y-4",
							children: [/* @__PURE__ */ jsxs("label", {
								htmlFor: "task-file-upload",
								className: "grid cursor-pointer place-items-center rounded-xl border-2 border-dashed border-border bg-surface-1 px-6 py-10 text-center transition-colors hover:border-primary/50 hover:bg-primary/5",
								children: [
									/* @__PURE__ */ jsx(Upload, {
										size: 32,
										className: "mb-3 text-muted-foreground"
									}),
									/* @__PURE__ */ jsx("p", {
										className: "text-sm font-semibold",
										children: "Arraste arquivos ou clique para enviar"
									}),
									/* @__PURE__ */ jsx("p", {
										className: "mt-1 text-xs text-muted-foreground",
										children: "PDF, XLSX, JSON, DOCX até 10MB"
									}),
									/* @__PURE__ */ jsx("input", {
										id: "task-file-upload",
										type: "file",
										className: "hidden",
										onChange: handleFileUpload
									})
								]
							}), /* @__PURE__ */ jsx("div", {
								className: "grid gap-2",
								children: task.files?.map((file) => /* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-3 rounded-lg border border-border bg-surface-1 px-3 py-2.5",
									children: [/* @__PURE__ */ jsx(Paperclip, {
										size: 16,
										className: "text-muted-foreground"
									}), /* @__PURE__ */ jsx("span", {
										className: "flex-1 truncate text-sm",
										children: file.filename
									})]
								}, file.id))
							})]
						})
					]
				}), /* @__PURE__ */ jsxs("aside", {
					className: "hidden w-64 shrink-0 border-l border-border bg-surface-1/40 p-5 lg:block",
					children: [/* @__PURE__ */ jsx("h4", {
						className: "text-[11px] font-bold uppercase tracking-wider text-muted-foreground",
						children: "Propriedades"
					}), /* @__PURE__ */ jsxs("div", {
						className: "mt-4 space-y-4",
						children: [
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "text-xs text-muted-foreground",
								children: "Responsável"
							}), /* @__PURE__ */ jsx("select", {
								value: edited.memberId,
								onChange: (e) => handleUpdate("memberId", e.target.value),
								className: "mt-1 w-full rounded-md border border-border bg-surface-2 px-2 py-1.5 text-sm outline-none focus:border-primary",
								children: members.map((m) => /* @__PURE__ */ jsx("option", {
									value: String(m.id),
									className: "bg-surface-2",
									children: m.name
								}, m.id))
							})] }),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "text-xs text-muted-foreground",
								children: "Prioridade"
							}), /* @__PURE__ */ jsx("select", {
								value: edited.priority,
								onChange: (e) => handleUpdate("priority", e.target.value),
								className: "mt-1 w-full rounded-md border border-border bg-surface-2 px-2 py-1.5 text-sm outline-none focus:border-primary",
								children: PRIORITIES.map((p) => /* @__PURE__ */ jsx("option", {
									value: p.id,
									className: "bg-surface-2",
									children: p.label
								}, p.id))
							})] }),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "text-xs text-muted-foreground",
								children: "Tempo gasto (h)"
							}), /* @__PURE__ */ jsx("input", {
								type: "number",
								min: 0,
								step: .5,
								value: edited.timeSpent,
								onChange: (e) => handleUpdate("timeSpent", parseFloat(e.target.value) || 0),
								className: "mt-1 w-full rounded-md border border-border bg-surface-2 px-2 py-1.5 text-sm outline-none focus:border-primary"
							})] }),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "text-xs text-muted-foreground",
								children: "Prazo"
							}), /* @__PURE__ */ jsx("input", {
								type: "date",
								value: edited.dueDate ? edited.dueDate.slice(0, 10) : "",
								onChange: (e) => handleUpdate("dueDate", e.target.value),
								className: "mt-1 w-full rounded-md border border-border bg-surface-2 px-2 py-1.5 text-sm outline-none focus:border-primary"
							})] })
						]
					})]
				})]
			})]
		})
	}), showDelete && /* @__PURE__ */ jsx(ConfirmModal, {
		title: "Excluir tarefa?",
		message: "Esta ação não pode ser desfeita.",
		onConfirm: handleDelete,
		onCancel: () => setShowDelete(false)
	})] });
}
//#endregion
//#region src/lib/websocket.ts
var wsBase = baseURL.replace(/^http/, "ws");
var WebSocketClient = class {
	ws = null;
	projectId = null;
	url = "";
	reconnectAttempts = 0;
	maxReconnectAttempts = 5;
	listeners = {};
	connect(projectId) {
		if (this.ws && this.projectId === projectId) return;
		this.disconnect();
		this.projectId = projectId;
		this.url = `${wsBase}/ws/projects/${projectId}`;
		this.setupConnection();
	}
	setupConnection() {
		this.ws = new WebSocket(this.url);
		this.ws.onopen = () => {
			console.log(`Connected to WS for project ${this.projectId}`);
			this.reconnectAttempts = 0;
		};
		this.ws.onmessage = (event) => {
			try {
				const data = JSON.parse(event.data);
				if (data.event && this.listeners[data.event]) this.listeners[data.event].forEach((cb) => cb(data.data));
			} catch (e) {
				console.error("Failed to parse WS message", e);
			}
		};
		this.ws.onclose = () => {
			console.log("WS closed");
			this.attemptReconnect();
		};
		this.ws.onerror = (error) => {
			console.error("WS Error", error);
			this.ws?.close();
		};
	}
	attemptReconnect() {
		if (this.reconnectAttempts < this.maxReconnectAttempts) {
			this.reconnectAttempts++;
			setTimeout(() => {
				console.log(`Attempting to reconnect... (${this.reconnectAttempts})`);
				this.setupConnection();
			}, 2e3 * this.reconnectAttempts);
		}
	}
	disconnect() {
		if (this.ws) {
			this.ws.close();
			this.ws = null;
		}
		this.projectId = null;
	}
	on(event, callback) {
		if (!this.listeners[event]) this.listeners[event] = [];
		this.listeners[event].push(callback);
	}
	off(event, callback) {
		if (!this.listeners[event]) return;
		this.listeners[event] = this.listeners[event].filter((cb) => cb !== callback);
	}
};
var wsClient = new WebSocketClient();
//#endregion
//#region src/routes/_app/index.tsx?tsr-split=component
var COLUMNS = [
	{
		id: "todo",
		title: "A Fazer"
	},
	{
		id: "in_progress",
		title: "Em Andamento"
	},
	{
		id: "blocked",
		title: "Bloqueado"
	},
	{
		id: "done",
		title: "Concluído"
	}
];
function DashboardPage() {
	const { tasks, members, filterMemberId, setFilterMember, fetchTasks, fetchMembers, moveTask, addTask, loading, teams, fetchTeams, projects, fetchProjects, activeProjectId, setActiveProject } = useTaskStore();
	const [activeTask, setActiveTask] = useState(null);
	const [showCreate, setShowCreate] = useState(false);
	const [selectedTeamId, setSelectedTeamId] = useState(null);
	const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
	useEffect(() => {
		const c = new AbortController();
		fetchMembers(c.signal);
		fetchTeams(c.signal);
		return () => c.abort();
	}, [fetchMembers, fetchTeams]);
	useEffect(() => {
		if (selectedTeamId) fetchProjects(selectedTeamId);
	}, [selectedTeamId, fetchProjects]);
	useEffect(() => {
		if (activeProjectId) {
			const c = new AbortController();
			fetchTasks(activeProjectId, c.signal);
			wsClient.connect(activeProjectId);
			wsClient.on("TASK_CREATED", () => fetchTasks(activeProjectId));
			wsClient.on("TASK_UPDATED", () => fetchTasks(activeProjectId));
			return () => {
				c.abort();
				wsClient.off("TASK_CREATED", () => fetchTasks(activeProjectId));
				wsClient.off("TASK_UPDATED", () => fetchTasks(activeProjectId));
				wsClient.disconnect();
			};
		}
	}, [activeProjectId, fetchTasks]);
	const handleDragEnd = (e) => {
		if (e.over && e.active.id !== e.over.id) moveTask(String(e.active.id), String(e.over.id));
	};
	const filtered = filterMemberId === "all" ? tasks : tasks.filter((t) => t.memberId === filterMemberId);
	const tasksByCol = (status) => filtered.filter((t) => t.status === status);
	if (!activeProjectId) return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Navbar, { members }), /* @__PURE__ */ jsx("main", {
		className: "mx-auto max-w-[1600px] px-4 py-12 sm:px-6 lg:px-8",
		children: /* @__PURE__ */ jsxs("div", {
			className: "mx-auto max-w-lg text-center",
			children: [
				/* @__PURE__ */ jsx("h2", {
					className: "text-2xl font-bold",
					children: "Selecione um Projeto"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Para ver o Kanban, escolha uma equipe e depois um projeto."
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-8 space-y-4 text-left",
					children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
						className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
						children: "Equipe"
					}), /* @__PURE__ */ jsxs("select", {
						className: "mt-1 w-full rounded-lg border border-border bg-surface-1 px-3 py-3 text-sm outline-none focus:border-primary",
						value: selectedTeamId || "",
						onChange: (e) => setSelectedTeamId(Number(e.target.value)),
						children: [/* @__PURE__ */ jsx("option", {
							value: "",
							children: "Selecione uma equipe"
						}), teams.map((t) => /* @__PURE__ */ jsx("option", {
							value: t.id,
							className: "bg-surface-2",
							children: t.name
						}, t.id))]
					})] }), selectedTeamId && /* @__PURE__ */ jsxs("div", {
						className: "mt-6",
						children: [
							/* @__PURE__ */ jsx("label", {
								className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block",
								children: "Projetos"
							}),
							/* @__PURE__ */ jsx("div", {
								className: "grid gap-3",
								children: projects.length === 0 ? /* @__PURE__ */ jsx("p", {
									className: "text-sm text-muted-foreground rounded-lg border border-dashed border-border p-4 text-center",
									children: "Nenhum projeto encontrado para esta equipe."
								}) : projects.map((p) => /* @__PURE__ */ jsxs("button", {
									onClick: () => setActiveProject(p.id),
									className: "flex w-full items-center justify-between rounded-xl border border-border bg-surface-1 p-4 text-left transition-all hover:border-primary hover:shadow-[var(--glow-primary)]",
									children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("span", {
										className: "block font-bold",
										children: p.name
									}), p.description && /* @__PURE__ */ jsx("span", {
										className: "block text-xs text-muted-foreground mt-1",
										children: p.description
									})] }), /* @__PURE__ */ jsx("span", {
										className: "text-primary",
										children: "→"
									})]
								}, p.id))
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "mt-4 pt-4 border-t border-border",
								children: [/* @__PURE__ */ jsx("p", {
									className: "text-xs font-semibold mb-2 text-muted-foreground",
									children: "CRIAR NOVO PROJETO"
								}), /* @__PURE__ */ jsxs("form", {
									onSubmit: async (e) => {
										e.preventDefault();
										const input = e.target.elements.namedItem("projectName");
										if (input.value.trim()) try {
											await useTaskStore.getState().addProject(selectedTeamId, input.value.trim());
											input.value = "";
											toast.success("Projeto criado!");
										} catch (err) {
											toast.error(err.toString());
										}
									},
									className: "flex gap-2",
									children: [/* @__PURE__ */ jsx("input", {
										name: "projectName",
										placeholder: "Nome do novo projeto",
										required: true,
										className: "flex-1 rounded-lg border border-border bg-surface-1 px-3 py-2 text-sm outline-none focus:border-primary"
									}), /* @__PURE__ */ jsx("button", {
										type: "submit",
										className: "rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:opacity-90",
										children: "Criar"
									})]
								})]
							})
						]
					})]
				})
			]
		})
	})] });
	const activeProject = projects.find((p) => p.id === activeProjectId);
	return /* @__PURE__ */ jsxs(Fragment, { children: [
		/* @__PURE__ */ jsx(Navbar, {
			onCreateTask: () => setShowCreate(true),
			showNewTask: true,
			filterValue: filterMemberId,
			onFilterChange: setFilterMember,
			members
		}),
		/* @__PURE__ */ jsxs("main", {
			className: "mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "mb-6 flex flex-wrap items-end justify-between gap-4",
				children: [/* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsxs("p", {
						className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
						children: [activeProject?.name, " / Kanban"]
					}),
					/* @__PURE__ */ jsx("h1", {
						className: "text-gradient mt-1 text-3xl font-black tracking-tight sm:text-4xl",
						children: "Fluxo de trabalho"
					}),
					/* @__PURE__ */ jsxs("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: [
							"Arraste para mover. Clique para abrir.",
							" ",
							/* @__PURE__ */ jsx("span", {
								className: "text-foreground",
								children: filtered.length
							}),
							" tarefas visíveis."
						]
					})
				] }), /* @__PURE__ */ jsx("button", {
					onClick: () => setActiveProject(null),
					className: "text-sm font-semibold text-primary underline transition-opacity hover:opacity-80",
					children: "Trocar Projeto"
				})]
			}), loading && tasks.length === 0 ? /* @__PURE__ */ jsx("div", {
				className: "grid h-[60vh] place-items-center text-sm text-muted-foreground",
				children: "Carregando..."
			}) : /* @__PURE__ */ jsx(DndContext, {
				sensors,
				onDragEnd: handleDragEnd,
				children: /* @__PURE__ */ jsx("div", {
					className: "flex gap-4 overflow-x-auto pb-4",
					children: COLUMNS.map((c) => /* @__PURE__ */ jsx(Column, {
						id: c.id,
						title: c.title,
						tasks: tasksByCol(c.id),
						members,
						onTaskClick: setActiveTask
					}, c.id))
				})
			})]
		}),
		activeTask && /* @__PURE__ */ jsx(ModalEditTask, {
			task: activeTask,
			members,
			onClose: () => setActiveTask(null)
		}),
		showCreate && /* @__PURE__ */ jsx(CreateTaskModal, {
			members,
			onClose: () => setShowCreate(false),
			onCreate: async (payload) => {
				try {
					await addTask(payload);
					toast.success("Tarefa criada!");
					setShowCreate(false);
				} catch {
					toast.error("Falha ao criar tarefa");
				}
			}
		})
	] });
}
function CreateTaskModal({ members, onClose, onCreate }) {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [memberId, setMemberId] = useState(members[0]?.id ? String(members[0].id) : "");
	const [priority, setPriority] = useState("medium");
	return /* @__PURE__ */ jsx("div", {
		onClick: onClose,
		className: "fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md animate-in fade-in",
		children: /* @__PURE__ */ jsxs("div", {
			onClick: (e) => e.stopPropagation(),
			className: "glass-strong w-full max-w-lg rounded-2xl p-6 animate-in zoom-in-95",
			children: [
				/* @__PURE__ */ jsx("h3", {
					className: "text-xl font-bold tracking-tight",
					children: "Nova tarefa"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Preencha os campos essenciais. Você pode editar tudo depois."
				}),
				/* @__PURE__ */ jsxs("form", {
					onSubmit: (e) => {
						e.preventDefault();
						if (!title || !memberId) return;
						onCreate({
							title,
							description,
							memberId,
							priority,
							status: "todo",
							tags: []
						});
					},
					className: "mt-5 space-y-4",
					children: [
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
							children: "Título"
						}), /* @__PURE__ */ jsx("input", {
							value: title,
							onChange: (e) => setTitle(e.target.value),
							required: true,
							autoFocus: true,
							className: "mt-1 w-full rounded-lg border border-border bg-surface-1 px-3 py-2 text-sm outline-none focus:border-primary"
						})] }),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
							className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
							children: "Descrição"
						}), /* @__PURE__ */ jsx("textarea", {
							value: description,
							onChange: (e) => setDescription(e.target.value),
							rows: 3,
							className: "mt-1 w-full resize-none rounded-lg border border-border bg-surface-1 px-3 py-2 text-sm outline-none focus:border-primary"
						})] }),
						/* @__PURE__ */ jsxs("div", {
							className: "grid gap-4 sm:grid-cols-2",
							children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
								children: "Responsável"
							}), /* @__PURE__ */ jsxs("select", {
								value: memberId,
								onChange: (e) => setMemberId(e.target.value),
								required: true,
								className: "mt-1 w-full rounded-lg border border-border bg-surface-1 px-3 py-2 text-sm outline-none focus:border-primary",
								children: [/* @__PURE__ */ jsx("option", {
									value: "",
									disabled: true,
									children: "Selecione"
								}), members.map((m) => /* @__PURE__ */ jsx("option", {
									value: String(m.id),
									className: "bg-surface-2",
									children: m.name
								}, m.id))]
							})] }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("label", {
								className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
								children: "Prioridade"
							}), /* @__PURE__ */ jsxs("select", {
								value: priority,
								onChange: (e) => setPriority(e.target.value),
								className: "mt-1 w-full rounded-lg border border-border bg-surface-1 px-3 py-2 text-sm outline-none focus:border-primary",
								children: [
									/* @__PURE__ */ jsx("option", {
										value: "low",
										className: "bg-surface-2",
										children: "Baixa"
									}),
									/* @__PURE__ */ jsx("option", {
										value: "medium",
										className: "bg-surface-2",
										children: "Média"
									}),
									/* @__PURE__ */ jsx("option", {
										value: "high",
										className: "bg-surface-2",
										children: "Alta"
									})
								]
							})] })]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "mt-2 flex gap-3",
							children: [/* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: onClose,
								className: "flex-1 rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm font-semibold hover:bg-surface-3",
								children: "Cancelar"
							}), /* @__PURE__ */ jsx("button", {
								type: "submit",
								className: "flex-1 rounded-lg bg-[image:var(--gradient-primary)] px-4 py-2.5 text-sm font-bold text-primary-foreground shadow-[var(--glow-primary)] hover:scale-[1.01]",
								children: "Criar tarefa"
							})]
						})
					]
				})
			]
		})
	});
}
//#endregion
export { DashboardPage as component };
