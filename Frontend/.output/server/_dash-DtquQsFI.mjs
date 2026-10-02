import { n as __toESM } from "./_runtime.mjs";
import { r as currentUser } from "./_ssr/mock-data-ZnmdXf5M.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { h as Outlet, y as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "./_libs/@radix-ui/react-collection+[...].mjs";
import { a as Upload, d as LogOut, g as FolderLock, k as Activity, l as Share2, n as User, p as LayoutDashboard, u as Menu } from "./_libs/lucide-react.mjs";
import { a as cn, t as Logo } from "./_ssr/medshare-DQMCsj8l.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_dash-DtquQsFI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var nav = [
	{
		to: "/dashboard",
		label: "Dashboard",
		icon: LayoutDashboard
	},
	{
		to: "/files",
		label: "My Files",
		icon: FolderLock
	},
	{
		to: "/shared",
		label: "Shared With Me",
		icon: Share2
	},
	{
		to: "/upload",
		label: "Upload File",
		icon: Upload
	},
	{
		to: "/activity",
		label: "Activity",
		icon: Activity
	},
	{
		to: "/profile",
		label: "Profile",
		icon: User
	}
];
function DashLayout() {
	const [open, setOpen] = (0, import_react.useState)(false);
	const item = "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen bg-muted",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: cn("fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r bg-sidebar p-4 transition-transform md:translate-x-0", open ? "translate-x-0" : "-translate-x-full"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Logo, { className: "mb-8 px-2" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "flex flex-1 flex-col gap-1",
						children: nav.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: n.to,
							onClick: () => setOpen(false),
							className: item,
							activeProps: { className: "bg-sidebar-accent text-sidebar-accent-foreground" },
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(n.icon, { className: "h-4 w-4" }),
								" ",
								n.label
							]
						}, n.to))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/login",
						className: cn(item, "text-destructive hover:bg-destructive/10"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4" }), " Logout"]
					})
				]
			}),
			open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-30 bg-foreground/20 md:hidden",
				onClick: () => setOpen(false)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 flex-1 flex-col md:pl-64",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur md:px-8",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "md:hidden",
						onClick: () => setOpen(true),
						"aria-label": "Open menu",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-5 w-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "ml-auto flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-right",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-semibold",
								children: currentUser.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: currentUser.role
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid h-9 w-9 place-items-center rounded-full bg-brand text-sm font-bold text-primary-foreground",
							children: "SA"
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "flex-1 p-4 animate-in fade-in duration-300 md:p-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
				})]
			})
		]
	});
}
//#endregion
export { DashLayout as component };
