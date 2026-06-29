import "./router-DzXCVrLb.js";
import { n as Navbar, t as useTaskStore } from "./useTaskStore-COpBNZKZ.js";
import { useEffect, useMemo, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { AlertCircle, Calendar, Clock } from "lucide-react";
import Calendar$1 from "react-calendar";
import { format, isSameDay } from "date-fns";
//#region src/routes/_app/calendar.tsx?tsr-split=component
var PRIO_DOT = {
	high: "bg-destructive",
	medium: "bg-warning",
	low: "bg-success"
};
function CalendarPage() {
	const { tasks, fetchTasks, members, fetchMembers } = useTaskStore();
	const [selected, setSelected] = useState(/* @__PURE__ */ new Date());
	useEffect(() => {
		const c = new AbortController();
		fetchTasks(c.signal);
		fetchMembers(c.signal);
		return () => c.abort();
	}, [fetchTasks, fetchMembers]);
	const tasksByDay = useMemo(() => {
		const map = /* @__PURE__ */ new Map();
		tasks.forEach((t) => {
			if (!t.dueDate) return;
			const key = format(new Date(t.dueDate), "yyyy-MM-dd");
			const arr = map.get(key) ?? [];
			arr.push(t);
			map.set(key, arr);
		});
		return map;
	}, [tasks]);
	const dayTasks = useMemo(() => tasks.filter((t) => t.dueDate && isSameDay(new Date(t.dueDate), selected)), [tasks, selected]);
	const memberName = (id) => members.find((m) => String(m.id) === id)?.name ?? "—";
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Navbar, {}), /* @__PURE__ */ jsxs("main", {
		className: "mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "mb-6",
			children: [/* @__PURE__ */ jsx("p", {
				className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
				children: "Cronograma"
			}), /* @__PURE__ */ jsx("h1", {
				className: "text-gradient mt-1 text-3xl font-black tracking-tight sm:text-4xl",
				children: "Calendário"
			})]
		}), /* @__PURE__ */ jsxs("div", {
			className: "grid gap-6 lg:grid-cols-[1fr_360px]",
			children: [/* @__PURE__ */ jsx("div", {
				className: "glass rounded-2xl p-4 sm:p-6",
				children: /* @__PURE__ */ jsx("div", {
					className: "rc-Taky",
					children: /* @__PURE__ */ jsx(Calendar$1, {
						value: selected,
						onChange: (v) => setSelected(v),
						tileContent: ({ date }) => {
							const key = format(date, "yyyy-MM-dd");
							const t = tasksByDay.get(key);
							if (!t || t.length === 0) return null;
							return /* @__PURE__ */ jsx("div", {
								className: "mt-1 flex justify-center gap-0.5",
								children: t.slice(0, 3).map((task) => /* @__PURE__ */ jsx("span", { className: `h-1.5 w-1.5 rounded-full ${PRIO_DOT[task.priority] ?? "bg-primary"}` }, task.id))
							});
						}
					})
				})
			}), /* @__PURE__ */ jsxs("aside", {
				className: "glass flex flex-col rounded-2xl p-5",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2 border-b border-border pb-3",
					children: [
						/* @__PURE__ */ jsx(Calendar, {
							size: 16,
							className: "text-primary"
						}),
						/* @__PURE__ */ jsx("h3", {
							className: "text-sm font-bold",
							children: format(selected, "dd 'de' MMMM, yyyy")
						}),
						/* @__PURE__ */ jsx("span", {
							className: "ml-auto rounded-full bg-surface-3 px-2 py-0.5 text-[10px] font-bold",
							children: dayTasks.length
						})
					]
				}), /* @__PURE__ */ jsx("div", {
					className: "mt-3 flex-1 space-y-2 overflow-y-auto",
					children: dayTasks.length === 0 ? /* @__PURE__ */ jsxs("div", {
						className: "grid place-items-center py-10 text-center text-sm text-muted-foreground",
						children: [/* @__PURE__ */ jsx(AlertCircle, {
							size: 32,
							className: "mb-2 opacity-30"
						}), "Sem tarefas para esta data."]
					}) : dayTasks.map((t) => /* @__PURE__ */ jsxs("div", {
						className: "rounded-xl border border-border bg-surface-1 p-3 transition-colors hover:border-primary/40",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between gap-2",
								children: [/* @__PURE__ */ jsx("span", {
									className: `rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase ${t.priority === "high" ? "bg-destructive/15 text-destructive" : t.priority === "medium" ? "bg-warning/15 text-warning" : "bg-success/15 text-success"}`,
									children: t.priority
								}), /* @__PURE__ */ jsxs("span", {
									className: "font-mono text-[10px] text-muted-foreground",
									children: ["#", t.id]
								})]
							}),
							/* @__PURE__ */ jsx("h4", {
								className: "mt-1.5 text-sm font-semibold",
								children: t.title
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "mt-2 flex items-center justify-between text-xs text-muted-foreground",
								children: [/* @__PURE__ */ jsx("span", { children: memberName(t.memberId) }), /* @__PURE__ */ jsxs("span", {
									className: "inline-flex items-center gap-1",
									children: [
										/* @__PURE__ */ jsx(Clock, { size: 11 }),
										t.timeSpent,
										"h"
									]
								})]
							})
						]
					}, t.id))
				})]
			})]
		})]
	})] });
}
//#endregion
export { CalendarPage as component };
