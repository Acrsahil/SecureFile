import { t as activity } from "./_ssr/mock-data-ZnmdXf5M.mjs";
import { o as require_jsx_runtime } from "./_libs/@radix-ui/react-collection+[...].mjs";
import { D as Ban, a as Upload, l as Share2, v as Eye } from "./_libs/lucide-react.mjs";
import { n as PageHeader } from "./_ssr/medshare-DQMCsj8l.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_dash.activity-BKUp_hWE.js
var import_jsx_runtime = require_jsx_runtime();
var icons = {
	upload: {
		icon: Upload,
		tone: "bg-accent text-accent-foreground"
	},
	share: {
		icon: Share2,
		tone: "bg-teal-soft text-teal"
	},
	access: {
		icon: Eye,
		tone: "bg-success-soft text-success"
	},
	revoke: {
		icon: Ban,
		tone: "bg-destructive/10 text-destructive"
	}
};
function ActivityPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Activity",
		subtitle: "Every upload, share and access is logged."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
		className: "relative max-w-2xl space-y-4 rounded-3xl border bg-card p-6 shadow-card",
		children: activity.map((a, i) => {
			const I = icons[a.kind];
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "relative flex gap-4",
				children: [
					i < activity.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute left-5 top-11 h-[calc(100%-1.5rem)] w-px bg-border" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `grid h-10 w-10 shrink-0 place-items-center rounded-full ${I.tone}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(I.icon, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium",
							children: a.text
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: a.time
						})]
					})
				]
			}, i);
		})
	})] });
}
//#endregion
export { ActivityPage as component };
