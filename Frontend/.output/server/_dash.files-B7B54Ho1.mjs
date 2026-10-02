import { n as __toESM } from "./_runtime.mjs";
import { i as myFiles } from "./_ssr/mock-data-ZnmdXf5M.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { y as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "./_libs/@radix-ui/react-collection+[...].mjs";
import { _ as FileText, a as Upload, l as Share2, o as Trash2, v as Eye } from "./_libs/lucide-react.mjs";
import { i as StatusBadge, n as PageHeader } from "./_ssr/medshare-DQMCsj8l.mjs";
import { t as Button } from "./_ssr/button-BaU3MCBt.mjs";
import { n as toast } from "./_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_dash.files-B7B54Ho1.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Files() {
	const [files, setFiles] = (0, import_react.useState)(myFiles);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "My Files",
		subtitle: "Documents you've uploaded.",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/upload",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, {}), " Upload"]
			})
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-3",
		children: files.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-2xl border bg-card p-5 shadow-card transition hover:-translate-y-0.5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid h-11 w-11 place-items-center rounded-xl bg-accent text-accent-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-5 w-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: f.status })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mt-4 font-semibold",
					children: f.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "mt-2 grid grid-cols-2 gap-y-1 text-xs text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Type" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
							className: "text-foreground",
							children: [
								f.type,
								" · ",
								f.size
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Uploaded" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "text-foreground",
							children: f.date
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Owner" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "text-foreground",
							children: f.owner
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "sm",
							variant: "outline",
							className: "flex-1",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/documents/$id",
								params: { id: f.id },
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, {}), " View"]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "sm",
							variant: "outline",
							className: "flex-1",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/upload",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share2, {}), " Share"]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "ghost",
							className: "text-destructive",
							"aria-label": "Delete",
							onClick: () => {
								setFiles((x) => x.filter((y) => y.id !== f.id));
								toast.success(`${f.name} deleted`);
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {})
						})
					]
				})
			]
		}, f.id))
	})] });
}
//#endregion
export { Files as component };
