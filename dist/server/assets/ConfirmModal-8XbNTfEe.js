import { jsx, jsxs } from "react/jsx-runtime";
//#region src/components/ConfirmModal.tsx
function ConfirmModal({ title, message, onConfirm, onCancel, confirmLabel = "Excluir", cancelLabel = "Cancelar", icon }) {
	return /* @__PURE__ */ jsx("div", {
		className: "fixed inset-0 z-[1500] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in",
		onClick: onCancel,
		children: /* @__PURE__ */ jsxs("div", {
			onClick: (e) => e.stopPropagation(),
			className: "glass-strong w-full max-w-md rounded-2xl p-8 text-center animate-in zoom-in-95",
			children: [
				icon && /* @__PURE__ */ jsx("div", {
					className: "mb-4 flex justify-center",
					children: icon
				}),
				/* @__PURE__ */ jsx("h3", {
					className: "text-xl font-bold tracking-tight",
					children: title
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: message
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-6 flex gap-3",
					children: [/* @__PURE__ */ jsx("button", {
						onClick: onCancel,
						className: "flex-1 rounded-lg border border-border bg-surface-2 px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-surface-3",
						children: cancelLabel
					}), /* @__PURE__ */ jsx("button", {
						onClick: onConfirm,
						className: "flex-1 rounded-lg border border-destructive/40 bg-destructive/15 px-4 py-2.5 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/25",
						children: confirmLabel
					})]
				})
			]
		})
	});
}
//#endregion
export { ConfirmModal as t };
