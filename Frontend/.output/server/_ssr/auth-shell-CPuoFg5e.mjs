import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { f as Lock } from "../_libs/lucide-react.mjs";
import { t as Logo } from "./medshare-DQMCsj8l.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-shell-CPuoFg5e.js
var import_jsx_runtime = require_jsx_runtime();
function AuthShell({ title, subtitle, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-screen place-items-center bg-hero px-4 py-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, { className: "mb-8 justify-center" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-3xl border bg-card p-8 shadow-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-2xl font-bold",
							children: title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: subtitle
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6",
							children
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-3 w-3" }), " Your connection is secure"]
				})
			]
		})
	});
}
//#endregion
export { AuthShell as t };
