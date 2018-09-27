/* jshint node: true, esversion: 6 */
exports.setModules = function () {
	var NA = this;

	NA.modules.RedisStore = require('connect-redis');

	NA.models = {};
	NA.models.User = require("../models/connectors/user.js");
	NA.models.Chat = require("../models/connectors/chat.js");
	NA.models.Edit = require("../models/connectors/edit.js");

	NA.modules.chat = require("./modules/chat.js");
	NA.modules.edit = require("./modules/edit.js");
};

exports.setSessions = function (next) {
	var NA = this,
		session = NA.modules.session,
		RedisStore = NA.modules.RedisStore(session);

	NA.sessionStore = new RedisStore();

	next();
};

exports.changeDom = function (next, locals, request, response) {
	var NA = this,
		Vue = require("vue"),
		VueRouter = require("vue-router"),
		renderers = require("vue-server-renderer"),
		renderer = renderers.createRenderer({
			template: locals.dom
		}),
		fs = NA.modules.fs,
		path = NA.modules.path,
		view = path.join(NA.serverPath, NA.webconfig.viewsRelativePath, locals.routeParameters.view + ".htm"),
		model = path.join(NA.serverPath, NA.webconfig.viewsRelativePath, locals.routeParameters.view + ".js"),
		appModel = path.join(NA.serverPath, NA.webconfig.viewsRelativePath, "app.js"),
		appView = path.join(NA.serverPath, NA.webconfig.viewsRelativePath, "app.htm"),
		specific = locals.specific;

	global.Vue = Vue;
	Vue.use(VueRouter);

	fs.readFile(view, "utf-8",  function (error, template) {
		var component = Vue.component(locals.routeParameters.view, require(model)(specific, template));
		Vue.component('height-transition', { template: '<span><slot></slot></span>' });
		fs.readFile(appView, "utf-8", function (error, template) {
			var router = new VueRouter({
					routes: [{
						path: locals.routeParameters.url,
						component: component,
						props: ['common', 'global']
					}]
				}),
				common = locals.common,
				webconfig = {
					options: require(path.join(NA.serverPath, NA.webconfig._options)),
					routes: NA.webconfig.routes
				},
				stream = renderer.renderToStream(new Vue(require(appModel)(common, template, router, webconfig)), locals);

			router.push(locals.routeParameters.url);

			stream.on('data', function (chunk) {
				response.write(chunk);
			});

			stream.on('end', function () {
				response.end();
			});
		});
	});
};

exports.setSockets = function () {
	var NA = this,
		io = NA.io,
		chat = NA.modules.chat,
		edit = NA.modules.edit;

	io.on('connection', function (socket) {
		var session = socket.request.session,
			sessionID = socket.request.sessionID;

		socket.on('app--init', function () {
			var user = (session.user) ? session.user.publics : {};
				socket.emit('app--init', sessionID, user);
		});
	});

	chat.setSockets.call(NA);
	edit.setSockets.call(NA);
};