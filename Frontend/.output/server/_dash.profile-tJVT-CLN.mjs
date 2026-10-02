import { n as __toESM } from "./_runtime.mjs";
import { r as currentUser } from "./_ssr/mock-data-ZnmdXf5M.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "./_libs/@radix-ui/react-collection+[...].mjs";
import { n as PageHeader } from "./_ssr/medshare-DQMCsj8l.mjs";
import { t as Button } from "./_ssr/button-BaU3MCBt.mjs";
import { n as toast } from "./_libs/sonner.mjs";
import { t as Input } from "./_ssr/input-B769ZgZZ.mjs";
import { t as Label } from "./_ssr/label-C3ON0Zfq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_dash.profile-tJVT-CLN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Profile() {
	const [p, setP] = (0, import_react.useState)(currentUser);
	const [edit, setEdit] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Profile",
		subtitle: "Your personal information."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "max-w-2xl rounded-3xl border bg-card p-6 shadow-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 flex items-center gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-16 w-16 place-items-center rounded-full bg-brand font-display text-xl font-bold text-primary-foreground",
				children: "SA"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-lg font-semibold",
				children: p.name
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted-foreground",
				children: [
					p.role,
					" · ",
					p.organization
				]
			})] })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "grid gap-4 sm:grid-cols-2",
			onSubmit: (e) => {
				e.preventDefault();
				setEdit(false);
				toast.success("Profile updated");
			},
			children: [[
				["name", "Name"],
				["email", "Email"],
				["role", "Role"],
				["organization", "Organization"]
			].map(([k, l]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: k,
					children: l
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: k,
					value: p[k],
					disabled: !edit || k === "role",
					maxLength: 100,
					onChange: (e) => setP({
						...p,
						[k]: e.target.value
					})
				})]
			}, k)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-2 sm:col-span-2",
				children: edit ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					children: "Save changes"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "outline",
					onClick: () => {
						setP(currentUser);
						setEdit(false);
					},
					children: "Cancel"
				})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					onClick: () => setEdit(true),
					children: "Edit profile"
				})
			})]
		})]
	})] });
}
//#endregion
export { Profile as component };
