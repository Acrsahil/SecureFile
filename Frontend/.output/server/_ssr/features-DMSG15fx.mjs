import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { _ as FileText, f as Lock, i as UserCheck, k as Activity, l as Share2, v as Eye } from "../_libs/lucide-react.mjs";
import { n as PublicNav, t as PublicFooter } from "./public-nav-DHMZIAxB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/features-DMSG15fx.js
var import_jsx_runtime = require_jsx_runtime();
var list = [
	{
		icon: Lock,
		title: "Encrypted storage",
		text: "Documents are stored securely and never public."
	},
	{
		icon: Share2,
		title: "Permission-based sharing",
		text: "Share with specific users only."
	},
	{
		icon: Eye,
		title: "View or download",
		text: "Choose View Only or View & Download access."
	},
	{
		icon: UserCheck,
		title: "Role-based accounts",
		text: "Patients, doctors and hospital staff."
	},
	{
		icon: FileText,
		title: "Document viewer",
		text: "Preview reports right inside the app."
	},
	{
		icon: Activity,
		title: "Activity history",
		text: "See who accessed what, and when."
	}
];
function Features() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicNav, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto max-w-6xl px-4 py-20",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-4xl font-bold",
						children: "Features"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 max-w-xl text-muted-foreground",
						children: "Built around one idea: only authorized users can access shared medical documents."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
						children: list.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border bg-card p-6 shadow-card",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(f.icon, { className: "h-6 w-6 text-primary" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mt-4 font-semibold",
									children: f.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm text-muted-foreground",
									children: f.text
								})
							]
						}, f.title))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PublicFooter, {})
		]
	});
}
//#endregion
export { Features as component };
