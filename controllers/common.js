/* jshint node: true, esversion: 6 */
exports.changeDom = function (next, locals) {
	var NA = this,
		Vue = require("vue"),
		renderers = require("vue-server-renderer"),
		renderer = renderers.createRenderer(),
		fs = NA.modules.fs,
		path = NA.modules.path,
		view = path.join(NA.serverPath, NA.webconfig.viewsRelativePath, locals.routeParameters.view + ".htm"),
		model = path.join(NA.serverPath, NA.webconfig.viewsRelativePath, locals.routeParameters.view + ".js");

	global.Vue = Vue;

	fs.readFile(view, "utf-8", function (error, view) {
		var name = locals.routeParameters.view,
			component = {
				template: "<" + name + " v-bind:common='common'></" + name + ">",
				components: {
					[name]: require(model)(locals.specific, view)
				},
				data: {
					common: locals.common
				}
			};
		renderer.renderToString(new Vue(component), function (error, html) {
			locals.dom = locals.dom.replace(/(<div is="router-view" [-a-zA-Z:='" \/>]+)(<\/div>)/g, '$1' + html.replace(' server-rendered="true"', "") + '$2');
			next();
		});
	});
};