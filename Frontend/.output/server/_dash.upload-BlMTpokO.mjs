import { n as __toESM } from "./_runtime.mjs";
import { o as users } from "./_ssr/mock-data-ZnmdXf5M.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { o as require_jsx_runtime } from "./_libs/@radix-ui/react-collection+[...].mjs";
import { S as Circle, _ as FileText, b as CloudUpload, t as X } from "./_libs/lucide-react.mjs";
import { a as cn, n as PageHeader, r as SecureNote } from "./_ssr/medshare-DQMCsj8l.mjs";
import { t as Button } from "./_ssr/button-BaU3MCBt.mjs";
import { n as toast } from "./_libs/sonner.mjs";
import { t as Label } from "./_ssr/label-C3ON0Zfq.mjs";
import { n as RadioGroupIndicator, r as RadioGroupItem$1, t as RadioGroup$1 } from "./_libs/@radix-ui/react-radio-group+[...].mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./_ssr/select-B4lDByr2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_dash.upload-BlMTpokO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var RadioGroup = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroup$1, {
		className: cn("grid gap-2", className),
		...props,
		ref
	});
});
RadioGroup.displayName = RadioGroup$1.displayName;
var RadioGroupItem = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroupItem$1, {
		ref,
		className: cn("aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50", className),
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroupIndicator, {
			className: "flex items-center justify-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, { className: "h-3.5 w-3.5 fill-primary" })
		})
	});
});
RadioGroupItem.displayName = RadioGroupItem$1.displayName;
function fmt(n) {
	return n > 1e6 ? `${(n / 1e6).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1e3))} KB`;
}
function UploadPage() {
	const [file, setFile] = (0, import_react.useState)(null);
	const [drag, setDrag] = (0, import_react.useState)(false);
	const [user, setUser] = (0, import_react.useState)("");
	const [access, setAccess] = (0, import_react.useState)("view");
	const input = (0, import_react.useRef)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Upload File",
		subtitle: "Add a medical document and choose who can access it."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6 lg:grid-cols-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4 lg:col-span-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				onDragOver: (e) => {
					e.preventDefault();
					setDrag(true);
				},
				onDragLeave: () => setDrag(false),
				onDrop: (e) => {
					e.preventDefault();
					setDrag(false);
					if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]);
				},
				className: cn("grid place-items-center rounded-3xl border-2 border-dashed bg-card p-12 text-center transition", drag ? "border-primary bg-accent" : "border-border"),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid h-16 w-16 place-items-center rounded-2xl bg-brand text-primary-foreground shadow-glow",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudUpload, { className: "h-8 w-8" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-5 font-display text-lg font-semibold",
						children: "Drag & Drop Medical Document"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "my-2 text-sm text-muted-foreground",
						children: "or"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => input.current?.click(),
						children: "Browse Files"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						ref: input,
						type: "file",
						className: "hidden",
						accept: ".pdf,.jpg,.jpeg,.png,.dcm",
						onChange: (e) => e.target.files?.[0] && setFile(e.target.files[0])
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-xs text-muted-foreground",
						children: "PDF, JPG, PNG or DICOM"
					})
				]
			}), file && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 rounded-2xl border bg-card p-4 shadow-card animate-in fade-in slide-in-from-bottom-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid h-10 w-10 place-items-center rounded-xl bg-accent text-accent-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-5 w-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-sm font-semibold",
							children: file.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: fmt(file.size)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						onClick: () => setFile(null),
						"aria-label": "Remove",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {})
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-5 rounded-3xl border bg-card p-6 shadow-card lg:col-span-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-semibold",
					children: "Share With"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Select user" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: user,
						onValueChange: setUser,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "w-full",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Search doctors, staff…" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: users.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: u,
							children: u
						}, u)) })]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Permission" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroup, {
						value: access,
						onValueChange: setAccess,
						className: "gap-2",
						children: [["view", "View Only"], ["download", "View & Download"]].map(([v, l]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm has-[:checked]:border-primary has-[:checked]:bg-accent",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroupItem, { value: v }),
								" ",
								l
							]
						}, v))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SecureNote, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "w-full",
					size: "lg",
					disabled: !file,
					onClick: () => {
						toast.success(`${file.name} uploaded${user ? ` and shared with ${user}` : ""}`);
						setFile(null);
						setUser("");
					},
					children: "Upload"
				})
			]
		})]
	})] });
}
//#endregion
export { UploadPage as component };
