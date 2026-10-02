globalThis.__nitro_main__ = import.meta.url;
import { i as HTTPError, n as defineLazyEventHandler, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import { t as HookableCore } from "./_libs/hookable.mjs";
import { r as FastResponse } from "./_libs/h3-v2+rou3+srvx.mjs";
//#region #nitro-vite-setup
function lazyService(loader) {
	let promise, mod;
	return { fetch(req) {
		if (mod) return mod.fetch(req);
		if (!promise) promise = loader().then((_mod) => mod = _mod.default || _mod);
		return promise.then((mod) => mod.fetch(req));
	} };
}
var services = { ["ssr"]: lazyService(() => import("./_ssr/ssr.mjs")) };
globalThis.__nitro_vite_envs__ = services;
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/assets/_dash-C5j5cNde.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"da2-SFezTsLx3YCtMS7y2u5eav37glU\"",
		"mtime": "2026-10-02T11:10:44.710Z",
		"size": 3490,
		"path": "../public/assets/_dash-C5j5cNde.js"
	},
	"/assets/_dash.dashboard-DjrgkYWP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"101a-X1rHsRmZ/K3uuJg7fPuXi27a8dA\"",
		"mtime": "2026-10-02T11:10:44.710Z",
		"size": 4122,
		"path": "../public/assets/_dash.dashboard-DjrgkYWP.js"
	},
	"/assets/_dash.activity-BRuzb6UF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"57f-DAXibk2FKQbkaUy9lQqk2pDMu2g\"",
		"mtime": "2026-10-02T11:10:44.710Z",
		"size": 1407,
		"path": "../public/assets/_dash.activity-BRuzb6UF.js"
	},
	"/assets/_dash.documents._id-CKdOGnSj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"136-hx3Lyxy8LurCjzQmykCUqHMwxzE\"",
		"mtime": "2026-10-02T11:10:44.710Z",
		"size": 310,
		"path": "../public/assets/_dash.documents._id-CKdOGnSj.js"
	},
	"/assets/_dash.documents._id-8lHD4eQ0.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1a81-yOitd0uufskCV6qb8AcSdGgQIf4\"",
		"mtime": "2026-10-02T11:10:44.710Z",
		"size": 6785,
		"path": "../public/assets/_dash.documents._id-8lHD4eQ0.js"
	},
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"a0-CKGXSIe7TSsqDTmGm/nY1t/o5d0\"",
		"mtime": "2026-10-02T11:10:45.038Z",
		"size": 160,
		"path": "../public/robots.txt"
	},
	"/assets/_dash.documents._id-DeGqdU58.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a8f-BySTYqaNWT2HB/K7Rj/7QDggKzc\"",
		"mtime": "2026-10-02T11:10:44.710Z",
		"size": 2703,
		"path": "../public/assets/_dash.documents._id-DeGqdU58.js"
	},
	"/assets/_dash.files-CYML2-Mx.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9bd-QEciKkPUxe9RMf+ruXtcFPc2jFQ\"",
		"mtime": "2026-10-02T11:10:44.710Z",
		"size": 2493,
		"path": "../public/assets/_dash.files-CYML2-Mx.js"
	},
	"/assets/_dash.profile-Dh8P48QI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"70c-zhbYErnNcAbgM4l7fY1bhithHJo\"",
		"mtime": "2026-10-02T11:10:44.710Z",
		"size": 1804,
		"path": "../public/assets/_dash.profile-Dh8P48QI.js"
	},
	"/assets/_dash.shared-DBJDUONy.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8aa-wSpNDpE87f9YBeRMPuNWjDrWlmU\"",
		"mtime": "2026-10-02T11:10:44.710Z",
		"size": 2218,
		"path": "../public/assets/_dash.shared-DBJDUONy.js"
	},
	"/assets/_dash.upload-J2kHeARb.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3612-gOdGXjRqrDsjxGlQnQaK49Rl4Ik\"",
		"mtime": "2026-10-02T11:10:44.710Z",
		"size": 13842,
		"path": "../public/assets/_dash.upload-J2kHeARb.js"
	},
	"/assets/about-CkbWK_a6.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"410-yU8Ouv5uC21+ZhsAJJhsLT/B0Ls\"",
		"mtime": "2026-10-02T11:10:44.710Z",
		"size": 1040,
		"path": "../public/assets/about-CkbWK_a6.js"
	},
	"/assets/activity-9wk4bdna.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e2-iFq9xQXAd55zVRIJVa5Zo9ffIZw\"",
		"mtime": "2026-10-02T11:10:44.710Z",
		"size": 226,
		"path": "../public/assets/activity-9wk4bdna.js"
	},
	"/assets/auth-shell-BlnO_4-A.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"381-oNCDX7rv6BSDx/2sUs26urpjuos\"",
		"mtime": "2026-10-02T11:10:44.710Z",
		"size": 897,
		"path": "../public/assets/auth-shell-BlnO_4-A.js"
	},
	"/assets/button-DD8UljEv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1242-S1ZiQbL8p9WV9dni3pOA3r22Pm0\"",
		"mtime": "2026-10-02T11:10:44.710Z",
		"size": 4674,
		"path": "../public/assets/button-DD8UljEv.js"
	},
	"/assets/eye-B0S3lnxh.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f8-cKz4zNi35VHN2NW6Wqhml2R5j38\"",
		"mtime": "2026-10-02T11:10:44.710Z",
		"size": 248,
		"path": "../public/assets/eye-B0S3lnxh.js"
	},
	"/assets/features-yD2POYtJ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"680-183NOTMfIfyUSk3A5DYQwPcn20s\"",
		"mtime": "2026-10-02T11:10:44.710Z",
		"size": 1664,
		"path": "../public/assets/features-yD2POYtJ.js"
	},
	"/assets/file-text-DvhP5ItR.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"179-6kgkc/we41/5v+5Uft9g/1koq6c\"",
		"mtime": "2026-10-02T11:10:44.710Z",
		"size": 377,
		"path": "../public/assets/file-text-DvhP5ItR.js"
	},
	"/assets/input-DEXkdult.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"269-Ab0aP/W2aPi+wwLetKxdyxZVPP0\"",
		"mtime": "2026-10-02T11:10:44.710Z",
		"size": 617,
		"path": "../public/assets/input-DEXkdult.js"
	},
	"/assets/label-CYVDg1KP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4f2-SoPy6Y0O0+pvtGcwpHnVEypqCnI\"",
		"mtime": "2026-10-02T11:10:44.710Z",
		"size": 1266,
		"path": "../public/assets/label-CYVDg1KP.js"
	},
	"/assets/link-BiDG0Mf6.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4e34-2p+GoyLTs93JELoGIneQ/3ruGrw\"",
		"mtime": "2026-10-02T11:10:44.710Z",
		"size": 20020,
		"path": "../public/assets/link-BiDG0Mf6.js"
	},
	"/assets/lock-DrvRDay-.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c6-Dpf0hziqjzbuXDXy/1HFNPXVEDE\"",
		"mtime": "2026-10-02T11:10:44.710Z",
		"size": 198,
		"path": "../public/assets/lock-DrvRDay-.js"
	},
	"/assets/login-DJtD3SdO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"564-7uNlE1KP7Z5M1fjxjaZ95hdyNN4\"",
		"mtime": "2026-10-02T11:10:44.710Z",
		"size": 1380,
		"path": "../public/assets/login-DJtD3SdO.js"
	},
	"/assets/index-DXQXVzQI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5ceff-nNAugCgTgt2Jwb5Wnj0TiC/fPNE\"",
		"mtime": "2026-10-02T11:10:44.708Z",
		"size": 380671,
		"path": "../public/assets/index-DXQXVzQI.js"
	},
	"/favicon.ico": {
		"type": "image/vnd.microsoft.icon",
		"etag": "\"4f95-3RXc3p2mhEAs1WBwaIvE0Y0uu0Y\"",
		"mtime": "2026-10-02T11:10:45.038Z",
		"size": 20373,
		"path": "../public/favicon.ico"
	},
	"/assets/matchContext-BnghL-Z7.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"10e-kqJBAic6Rr9MVqRGfoGtpUYNItg\"",
		"mtime": "2026-10-02T11:10:44.710Z",
		"size": 270,
		"path": "../public/assets/matchContext-BnghL-Z7.js"
	},
	"/assets/medshare-H8LC0_yy.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7745-ZKs65IKCyvtuA5L4nr3QmGmT5rc\"",
		"mtime": "2026-10-02T11:10:44.710Z",
		"size": 30533,
		"path": "../public/assets/medshare-H8LC0_yy.js"
	},
	"/assets/mock-data-BkX_H-KL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"79d-t9GGaSpIJaHhaAuDu4LczgIKtNI\"",
		"mtime": "2026-10-02T11:10:44.710Z",
		"size": 1949,
		"path": "../public/assets/mock-data-BkX_H-KL.js"
	},
	"/assets/public-nav-CKA8cJte.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"53a-Tu+zY2SYGkfFvCOlcmy70ZhBCKg\"",
		"mtime": "2026-10-02T11:10:44.710Z",
		"size": 1338,
		"path": "../public/assets/public-nav-CKA8cJte.js"
	},
	"/assets/react-dom-C70l1qpk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f10-Z08zRJUxVh8E0nMAUZoiPQ18Evs\"",
		"mtime": "2026-10-02T11:10:44.710Z",
		"size": 3856,
		"path": "../public/assets/react-dom-C70l1qpk.js"
	},
	"/assets/register-BPopJZ_C.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8bd-QM0Q3vIj1knYv93+WwVuwMsbt5Y\"",
		"mtime": "2026-10-02T11:10:44.710Z",
		"size": 2237,
		"path": "../public/assets/register-BPopJZ_C.js"
	},
	"/assets/routes-BTZMKgHM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1055-BqxA0tAwT0LvkvzF4rQ8zH65xnE\"",
		"mtime": "2026-10-02T11:10:44.710Z",
		"size": 4181,
		"path": "../public/assets/routes-BTZMKgHM.js"
	},
	"/assets/share-2-DfECD22N.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"15d-glHoQ5MoKxb9My5eOdAS6DmKFFs\"",
		"mtime": "2026-10-02T11:10:44.710Z",
		"size": 349,
		"path": "../public/assets/share-2-DfECD22N.js"
	},
	"/assets/select-A-nrncwm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"14d84-qBfXnItalxUsTGVjDAcHMPT33BQ\"",
		"mtime": "2026-10-02T11:10:44.710Z",
		"size": 85380,
		"path": "../public/assets/select-A-nrncwm.js"
	},
	"/assets/upload-DvO9Mm9T.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"de-svniynwTBMZbZ883HGPV3GwYtAE\"",
		"mtime": "2026-10-02T11:10:44.710Z",
		"size": 222,
		"path": "../public/assets/upload-DvO9Mm9T.js"
	},
	"/assets/useNavigate-DB8dIkV1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b8-pLn68V8jShwv00hgI/zVEdstNu8\"",
		"mtime": "2026-10-02T11:10:44.710Z",
		"size": 184,
		"path": "../public/assets/useNavigate-DB8dIkV1.js"
	},
	"/assets/styles-BhZWlkra.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"13472-2m4F1AuOp1l9kJtk70slW4bnHpg\"",
		"mtime": "2026-10-02T11:10:44.711Z",
		"size": 78962,
		"path": "../public/assets/styles-BhZWlkra.css"
	},
	"/assets/user-check-BONDtYRS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"eb-sLMjhQaxtTDe+4RA0Asjv0auI+M\"",
		"mtime": "2026-10-02T11:10:44.710Z",
		"size": 235,
		"path": "../public/assets/user-check-BONDtYRS.js"
	},
	"/assets/x-0lPQx6Hc.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"92-32w/TfM1gYvvKB2aVP1UIbc3vuo\"",
		"mtime": "2026-10-02T11:10:44.711Z",
		"size": 146,
		"path": "../public/assets/x-0lPQx6Hc.js"
	}
};
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy_oiiq80 = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_oiiq80
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
[].filter(Boolean);
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new FastResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region #nitro/virtual/app
function createNitroApp() {
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks: void 0,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function useNitroHooks() {
	const nitroApp = useNitroApp();
	const hooks = nitroApp.hooks;
	if (hooks) return hooks;
	return nitroApp.hooks = new HookableCore();
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
	for (const rule of orderedRules) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/_module-handler.mjs
function createHandler(hooks) {
	const nitroApp = useNitroApp();
	const nitroHooks = useNitroHooks();
	return {
		async fetch(request, env, context) {
			globalThis.__env__ = env;
			augmentReq(request, {
				env,
				context
			});
			const ctxExt = {};
			const url = new URL(request.url);
			if (hooks.fetch) {
				const res = await hooks.fetch(request, env, context, url, ctxExt);
				if (res) return res;
			}
			return await nitroApp.fetch(request);
		},
		scheduled(controller, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:scheduled", {
				controller,
				env,
				context
			}) || Promise.resolve());
		},
		email(message, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:email", {
				message,
				event: message,
				env,
				context
			}) || Promise.resolve());
		},
		queue(batch, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:queue", {
				batch,
				event: batch,
				env,
				context
			}) || Promise.resolve());
		},
		tail(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:tail", {
				traces,
				env,
				context
			}) || Promise.resolve());
		},
		trace(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:trace", {
				traces,
				env,
				context
			}) || Promise.resolve());
		}
	};
}
function augmentReq(cfReq, ctx) {
	const req = cfReq;
	req.ip = cfReq.headers.get("cf-connecting-ip") || void 0;
	req.runtime ??= { name: "cloudflare" };
	req.runtime.cloudflare = {
		...req.runtime.cloudflare,
		...ctx
	};
	req.waitUntil = ctx.context?.waitUntil.bind(ctx.context);
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/cloudflare-module.mjs
var cloudflare_module_default = createHandler({ fetch(cfRequest, env, context, url) {
	if (env.ASSETS && isPublicAssetURL(url.pathname)) return env.ASSETS.fetch(cfRequest);
} });
//#endregion
export { cloudflare_module_default as default };
