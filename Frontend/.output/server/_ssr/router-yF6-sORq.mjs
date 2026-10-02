import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as createFileRoute, d as Scripts, f as HeadContent, g as lazyRouteComponent, h as Outlet, m as createRouter, v as createRootRouteWithContext, x as useRouter, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as Route$13 } from "../_dash.documents._id-DnVhQw8y.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { t as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-yF6-sORq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-BhZWlkra.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const message = error instanceof Response ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}` : error instanceof Error ? error.message : String(error);
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message,
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$12 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "MedShare — Secure Medical File Sharing" },
			{
				name: "description",
				content: "Securely share medical documents with authorized healthcare professionals."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Sora:wght@600;700&display=swap"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$12.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client: queryClient,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {
			richColors: true,
			position: "top-right"
		})]
	});
}
var $$splitComponentImporter$11 = () => import("./routes-BnprkZbp.mjs");
var Route$11 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "MedShare — Secure Medical File Sharing" },
		{
			name: "description",
			content: "Share prescriptions, lab reports and X-rays securely with authorized healthcare professionals."
		},
		{
			property: "og:title",
			content: "MedShare — Secure Medical File Sharing"
		},
		{
			property: "og:description",
			content: "Share medical documents securely with authorized healthcare professionals."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("../_dash-DtquQsFI.mjs");
var Route$10 = createFileRoute("/_dash")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
var $$splitComponentImporter$9 = () => import("./about-BYyZ3ixG.mjs");
var Route$9 = createFileRoute("/about")({
	head: () => ({ meta: [
		{ title: "About — MedShare" },
		{
			name: "description",
			content: "MedShare is a final-year college project for secure medical file sharing."
		},
		{
			property: "og:title",
			content: "About — MedShare"
		},
		{
			property: "og:description",
			content: "The story behind the MedShare secure medical file sharing prototype."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./features-DMSG15fx.mjs");
var Route$8 = createFileRoute("/features")({
	head: () => ({ meta: [
		{ title: "Features — MedShare" },
		{
			name: "description",
			content: "Secure uploads, permission-based sharing, access control and activity history for medical documents."
		},
		{
			property: "og:title",
			content: "Features — MedShare"
		},
		{
			property: "og:description",
			content: "Everything MedShare offers for secure medical document sharing."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./login-e58XEbFD.mjs");
var Route$7 = createFileRoute("/login")({
	head: () => ({ meta: [
		{ title: "Login — MedShare" },
		{
			name: "description",
			content: "Sign in to your MedShare account."
		},
		{
			property: "og:title",
			content: "Login — MedShare"
		},
		{
			property: "og:description",
			content: "Sign in to access your secure medical documents."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./register-BcuiaqkE.mjs");
var Route$6 = createFileRoute("/register")({
	head: () => ({ meta: [
		{ title: "Register — MedShare" },
		{
			name: "description",
			content: "Create a MedShare account as a patient, doctor or hospital staff."
		},
		{
			property: "og:title",
			content: "Register — MedShare"
		},
		{
			property: "og:description",
			content: "Join MedShare to share medical documents securely."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("../_dash.activity-BKUp_hWE.mjs");
var Route$5 = createFileRoute("/_dash/activity")({
	head: () => ({ meta: [
		{ title: "Activity — MedShare" },
		{
			name: "description",
			content: "Timeline of uploads, shares and document access."
		},
		{
			property: "og:title",
			content: "Activity — MedShare"
		},
		{
			property: "og:description",
			content: "Your MedShare activity history."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("../_dash.dashboard-B9ul8LMf.mjs");
var Route$4 = createFileRoute("/_dash/dashboard")({
	head: () => ({ meta: [
		{ title: "Dashboard — MedShare" },
		{
			name: "description",
			content: "Overview of your medical documents and sharing activity."
		},
		{
			property: "og:title",
			content: "Dashboard — MedShare"
		},
		{
			property: "og:description",
			content: "Your MedShare overview."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("../_dash.files-B7B54Ho1.mjs");
var Route$3 = createFileRoute("/_dash/files")({
	head: () => ({ meta: [
		{ title: "My Files — MedShare" },
		{
			name: "description",
			content: "Manage your uploaded medical documents."
		},
		{
			property: "og:title",
			content: "My Files — MedShare"
		},
		{
			property: "og:description",
			content: "Your uploaded medical documents."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("../_dash.profile-tJVT-CLN.mjs");
var Route$2 = createFileRoute("/_dash/profile")({
	head: () => ({ meta: [
		{ title: "Profile — MedShare" },
		{
			name: "description",
			content: "View and edit your MedShare profile."
		},
		{
			property: "og:title",
			content: "Profile — MedShare"
		},
		{
			property: "og:description",
			content: "Your MedShare profile details."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("../_dash.shared-DJj6668H.mjs");
var Route$1 = createFileRoute("/_dash/shared")({
	head: () => ({ meta: [
		{ title: "Shared With Me — MedShare" },
		{
			name: "description",
			content: "Medical documents others have shared with you."
		},
		{
			property: "og:title",
			content: "Shared With Me — MedShare"
		},
		{
			property: "og:description",
			content: "Documents shared with you on MedShare."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("../_dash.upload-BlMTpokO.mjs");
var Route = createFileRoute("/_dash/upload")({
	head: () => ({ meta: [
		{ title: "Upload File — MedShare" },
		{
			name: "description",
			content: "Upload a medical document and share it with authorized users."
		},
		{
			property: "og:title",
			content: "Upload File — MedShare"
		},
		{
			property: "og:description",
			content: "Upload and securely share a medical document."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var IndexRoute = Route$11.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$12
});
var DashRoute = Route$10.update({
	id: "/_dash",
	getParentRoute: () => Route$12
});
var AboutRoute = Route$9.update({
	id: "/about",
	path: "/about",
	getParentRoute: () => Route$12
});
var FeaturesRoute = Route$8.update({
	id: "/features",
	path: "/features",
	getParentRoute: () => Route$12
});
var LoginRoute = Route$7.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$12
});
var RegisterRoute = Route$6.update({
	id: "/register",
	path: "/register",
	getParentRoute: () => Route$12
});
var DashRouteChildren = {
	DashActivityRoute: Route$5.update({
		id: "/activity",
		path: "/activity",
		getParentRoute: () => DashRoute
	}),
	DashDashboardRoute: Route$4.update({
		id: "/dashboard",
		path: "/dashboard",
		getParentRoute: () => DashRoute
	}),
	DashFilesRoute: Route$3.update({
		id: "/files",
		path: "/files",
		getParentRoute: () => DashRoute
	}),
	DashProfileRoute: Route$2.update({
		id: "/profile",
		path: "/profile",
		getParentRoute: () => DashRoute
	}),
	DashSharedRoute: Route$1.update({
		id: "/shared",
		path: "/shared",
		getParentRoute: () => DashRoute
	}),
	DashUploadRoute: Route.update({
		id: "/upload",
		path: "/upload",
		getParentRoute: () => DashRoute
	}),
	DashDocumentsIdRoute: Route$13.update({
		id: "/documents/$id",
		path: "/documents/$id",
		getParentRoute: () => DashRoute
	})
};
var rootRouteChildren = {
	IndexRoute,
	DashRoute: DashRoute._addFileChildren(DashRouteChildren),
	AboutRoute,
	FeaturesRoute,
	LoginRoute,
	RegisterRoute
};
var routeTree = Route$12._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
