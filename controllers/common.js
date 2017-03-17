/* jshint node: true, esversion: 6 */
exports.changeDom = function (next, locals, request, response) {
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
		var layoutSections = locals.dom.split(/<div is="router-view" v-bind:common="common"><\/div>/g),
			preAppHTML = layoutSections[0],
			postAppHTML = layoutSections[1],
			name = locals.routeParameters.view,
			component = {
				template: "<" + name + " v-bind:common='common'></" + name + ">",
				components: {
					[name]: require(model)(locals.specific, view)
				},
				data: {
					common: locals.common
				}
			},
			stream = renderer.renderToStream(new Vue(component));

		response.write(preAppHTML + '<div is="router-view" v-bind:common="common">');

		stream.on('data', function (chunk) {
			response.write(chunk);
  		});

  		stream.on('end', function () {
    		response.end(postAppHTML + '</div>');
  		});
	});
};