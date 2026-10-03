import { n as allDocs } from "./_ssr/mock-data-ZnmdXf5M.mjs";
import { _ as createFileRoute, g as lazyRouteComponent, q as notFound } from "./_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_dash.documents._id-DnVhQw8y.js
var $$splitComponentImporter = () => import("./_dash.documents._id-BX10Yk7c.mjs");
var $$splitNotFoundComponentImporter = () => import("./_dash.documents._id-GP03CrXt.mjs");
var Route = createFileRoute("/_dash/documents/$id")({
	loader: ({ params }) => {
		const doc = allDocs.find((d) => d.id === params.id);
		if (!doc) throw notFound();
		return { doc };
	},
	head: ({ loaderData }) => ({ meta: loaderData ? [
		{ title: `${loaderData.doc.name} — MedShare` },
		{
			name: "description",
			content: `Secure preview of ${loaderData.doc.name}.`
		},
		{
			property: "og:title",
			content: `${loaderData.doc.name} — MedShare`
		},
		{
			property: "og:description",
			content: "Authorized access document viewer."
		}
	] : [{ title: "Not found — SecureMediShare" }, {
		name: "robots",
		content: "noindex"
	}] }),
	notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent"),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
