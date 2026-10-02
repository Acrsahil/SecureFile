import { x as useRouter } from "./_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "./_libs/@radix-ui/react-collection+[...].mjs";
import { _ as FileText, c as ShieldCheck, f as Lock, t as X, v as Eye, y as Download } from "./_libs/lucide-react.mjs";
import { i as StatusBadge } from "./_ssr/medshare-DQMCsj8l.mjs";
import { t as Route } from "./_dash.documents._id-DnVhQw8y.mjs";
import { t as Button } from "./_ssr/button-BaU3MCBt.mjs";
import { n as toast } from "./_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_dash.documents._id-BX10Yk7c.js
var import_jsx_runtime = require_jsx_runtime();
function Viewer() {
	const { doc } = Route.useLoaderData();
	const router = useRouter();
	const canDownload = doc.access === "View & Download";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6 lg:grid-cols-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "lg:col-span-2 rounded-3xl border bg-card p-4 shadow-card",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid aspect-[3/4] max-h-[75vh] w-full place-items-center rounded-2xl bg-muted",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "mx-auto h-16 w-16 text-primary" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3 font-display font-semibold",
							children: [
								doc.name,
								".",
								doc.type.toLowerCase()
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							children: "Document preview"
						})
					]
				})
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-3xl border bg-card p-6 shadow-card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-xl font-bold",
							children: doc.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: doc.status })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
						className: "mt-5 space-y-3 text-sm",
						children: [
							["Uploaded by", doc.owner],
							["Date", doc.date],
							["File", `${doc.type} · ${doc.size}`],
							["Access permission", doc.access]
						].map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-muted-foreground",
								children: k
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "font-medium text-right",
								children: v
							})]
						}, k))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 flex items-center gap-3 rounded-2xl bg-teal-soft p-4 text-teal",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-6 w-6 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-semibold",
							children: "Authorized Access"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs",
							children: "You have permission to open this file."
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 grid gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								onClick: () => toast("Opening secure viewer…"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, {}), " View"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								disabled: !canDownload,
								onClick: () => toast.success("Download started"),
								children: [canDownload ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, {}), " Download"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "ghost",
								onClick: () => router.history.back(),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {}), " Close"]
							})
						]
					})
				]
			})
		})]
	});
}
//#endregion
export { Viewer as component };
