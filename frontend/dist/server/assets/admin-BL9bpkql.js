import { n as Navbar, t as useTaskStore } from "./useTaskStore-COpBNZKZ.js";
import { useEffect, useMemo } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { AlertTriangle, CheckCircle2, Clock, ListChecks } from "lucide-react";
import { Bar, BarChart, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
//#region src/routes/_app/admin.tsx?tsr-split=component
var STATUS_LABEL = {
	todo: "A Fazer",
	in_progress: "Em Andamento",
	blocked: "Bloqueado",
	done: "Concluído"
};
var PRIO_COLORS = {
	high: "oklch(0.68 0.22 22)",
	medium: "oklch(0.78 0.16 70)",
	low: "oklch(0.72 0.17 155)"
};
function AdminPage() {
	const { tasks, members, fetchTasks, fetchMembers } = useTaskStore();
	useEffect(() => {
		const c = new AbortController();
		fetchTasks(c.signal);
		fetchMembers(c.signal);
		return () => c.abort();
	}, [fetchTasks, fetchMembers]);
	const stats = useMemo(() => {
		const done = tasks.filter((t) => t.status === "done").length;
		const blocked = tasks.filter((t) => t.status === "blocked").length;
		const totalHours = tasks.reduce((sum, t) => sum + (t.timeSpent || 0), 0);
		return {
			total: tasks.length,
			done,
			blocked,
			pct: tasks.length ? Math.round(done / tasks.length * 100) : 0,
			totalHours
		};
	}, [tasks]);
	const statusData = useMemo(() => Object.keys(STATUS_LABEL).map((status) => ({
		name: STATUS_LABEL[status],
		value: tasks.filter((t) => t.status === status).length
	})), [tasks]);
	const prioData = useMemo(() => [
		"high",
		"medium",
		"low"
	].map((p) => ({
		name: p,
		value: tasks.filter((t) => t.priority === p).length
	})), [tasks]);
	const perMember = useMemo(() => members.map((m) => ({
		name: m.name?.split(" ")[0] ?? "—",
		tarefas: tasks.filter((t) => t.memberId === String(m.id)).length,
		horas: tasks.filter((t) => t.memberId === String(m.id)).reduce((sum, t) => sum + (t.timeSpent || 0), 0)
	})), [members, tasks]);
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx(Navbar, {}), /* @__PURE__ */ jsxs("main", {
		className: "mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "mb-6",
				children: [/* @__PURE__ */ jsx("p", {
					className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
					children: "Visão geral"
				}), /* @__PURE__ */ jsx("h1", {
					className: "text-gradient mt-1 text-3xl font-black tracking-tight sm:text-4xl",
					children: "Analytics"
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ jsx(KpiCard, {
						icon: /* @__PURE__ */ jsx(ListChecks, {
							className: "text-info",
							size: 18
						}),
						label: "Total",
						value: stats.total
					}),
					/* @__PURE__ */ jsx(KpiCard, {
						icon: /* @__PURE__ */ jsx(CheckCircle2, {
							className: "text-success",
							size: 18
						}),
						label: "Concluídas",
						value: `${stats.done} (${stats.pct}%)`
					}),
					/* @__PURE__ */ jsx(KpiCard, {
						icon: /* @__PURE__ */ jsx(AlertTriangle, {
							className: "text-destructive",
							size: 18
						}),
						label: "Bloqueadas",
						value: stats.blocked
					}),
					/* @__PURE__ */ jsx(KpiCard, {
						icon: /* @__PURE__ */ jsx(Clock, {
							className: "text-warning",
							size: 18
						}),
						label: "Horas registradas",
						value: `${stats.totalHours}h`
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mt-6 grid gap-6 lg:grid-cols-3",
				children: [
					/* @__PURE__ */ jsx(ChartCard, {
						title: "Tarefas por status",
						span: "lg:col-span-2",
						children: /* @__PURE__ */ jsx(ResponsiveContainer, {
							width: "100%",
							height: 280,
							children: /* @__PURE__ */ jsxs(BarChart, {
								data: statusData,
								children: [
									/* @__PURE__ */ jsx(XAxis, {
										dataKey: "name",
										stroke: "oklch(0.66 0.02 256)",
										fontSize: 12
									}),
									/* @__PURE__ */ jsx(YAxis, {
										stroke: "oklch(0.66 0.02 256)",
										fontSize: 12,
										allowDecimals: false
									}),
									/* @__PURE__ */ jsx(Tooltip, {
										contentStyle: {
											background: "oklch(0.22 0.024 260)",
											border: "1px solid oklch(1 0 0 / 0.1)",
											borderRadius: 12
										},
										labelStyle: { color: "oklch(0.97 0.01 250)" }
									}),
									/* @__PURE__ */ jsx(Bar, {
										dataKey: "value",
										fill: "oklch(0.78 0.16 220)",
										radius: [
											8,
											8,
											0,
											0
										]
									})
								]
							})
						})
					}),
					/* @__PURE__ */ jsx(ChartCard, {
						title: "Por prioridade",
						children: /* @__PURE__ */ jsx(ResponsiveContainer, {
							width: "100%",
							height: 280,
							children: /* @__PURE__ */ jsxs(PieChart, { children: [
								/* @__PURE__ */ jsx(Pie, {
									data: prioData,
									dataKey: "value",
									nameKey: "name",
									innerRadius: 60,
									outerRadius: 90,
									paddingAngle: 2,
									children: prioData.map((entry) => /* @__PURE__ */ jsx(Cell, { fill: PRIO_COLORS[entry.name] }, entry.name))
								}),
								/* @__PURE__ */ jsx(Legend, {}),
								/* @__PURE__ */ jsx(Tooltip, { contentStyle: {
									background: "oklch(0.22 0.024 260)",
									border: "1px solid oklch(1 0 0 / 0.1)",
									borderRadius: 12
								} })
							] })
						})
					}),
					/* @__PURE__ */ jsx(ChartCard, {
						title: "Carga por pessoa",
						span: "lg:col-span-3",
						children: /* @__PURE__ */ jsx(ResponsiveContainer, {
							width: "100%",
							height: 300,
							children: /* @__PURE__ */ jsxs(BarChart, {
								data: perMember,
								children: [
									/* @__PURE__ */ jsx(XAxis, {
										dataKey: "name",
										stroke: "oklch(0.66 0.02 256)",
										fontSize: 12
									}),
									/* @__PURE__ */ jsx(YAxis, {
										stroke: "oklch(0.66 0.02 256)",
										fontSize: 12,
										allowDecimals: false
									}),
									/* @__PURE__ */ jsx(Tooltip, { contentStyle: {
										background: "oklch(0.22 0.024 260)",
										border: "1px solid oklch(1 0 0 / 0.1)",
										borderRadius: 12
									} }),
									/* @__PURE__ */ jsx(Legend, {}),
									/* @__PURE__ */ jsx(Bar, {
										dataKey: "tarefas",
										fill: "oklch(0.78 0.16 220)",
										radius: [
											6,
											6,
											0,
											0
										]
									}),
									/* @__PURE__ */ jsx(Bar, {
										dataKey: "horas",
										fill: "oklch(0.78 0.16 70)",
										radius: [
											6,
											6,
											0,
											0
										]
									})
								]
							})
						})
					})
				]
			})
		]
	})] });
}
function KpiCard({ icon, label, value }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "glass rounded-2xl p-5",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground",
			children: [icon, label]
		}), /* @__PURE__ */ jsx("p", {
			className: "mt-3 text-3xl font-black tracking-tight",
			children: value
		})]
	});
}
function ChartCard({ title, span, children }) {
	return /* @__PURE__ */ jsxs("div", {
		className: `glass rounded-2xl p-5 ${span ?? ""}`,
		children: [/* @__PURE__ */ jsx("h3", {
			className: "text-sm font-bold",
			children: title
		}), /* @__PURE__ */ jsx("div", {
			className: "mt-4",
			children
		})]
	});
}
//#endregion
export { AdminPage as component };
