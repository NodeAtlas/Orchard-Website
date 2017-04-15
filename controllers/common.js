/* jshint node: true, esversion: 6 */
exports.setModules = function () {
	var NA = this;

	NA.models = {};
	NA.models.User = require("../models/connectors/user.js");
	NA.models.Chat = require("../models/connectors/chat.js");
};

exports.changeDom = function (next, locals, request, response) {
	var NA = this,
		Vue = require("vue"),
		VueRouter = require("vue-router"),
		renderers = require("vue-server-renderer"),
		renderer = renderers.createRenderer(),
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
		var component = Vue.component('all', require(model)(specific, template));
		fs.readFile(appView, "utf-8", function (error, template) {
			var layoutSections = locals.dom.split('<div class="layout"></div>'),
				preAppHTML = layoutSections[0],
				postAppHTML = layoutSections[1],
				router = new VueRouter({
					routes: [{
						path: locals.routeParameters.url,
						component: component,
						props: ['common']
					}]
				}),
				common = locals.common,
				webconfig = {
					routes: NA.webconfig.routes
				},
				stream = renderer.renderToStream(new Vue(require(appModel)(common, template, router, webconfig)));

			router.push(locals.routeParameters.url);

			response.write(preAppHTML);

			stream.on('data', function (chunk) {
				response.write(chunk);
			});

			stream.on('end', function () {
				response.end(postAppHTML);
			});
		});
	});
};

exports.setSockets = function () {
	var NA = this,
		io = NA.io,
		path = NA.modules.path,
		Chat = NA.models.Chat;

	NA.sockets = [];

	io.on('connection', function (socket) {
		var session = socket.request.session,
			sessionID = socket.request.sessionID;

		NA.sockets.push(socket);
		/*console.log("====================");
		console.log('Connect!');
		NA.sockets.forEach(function (item) {
			console.log(item.id, item.request.sessionID);
		});
		console.log("====================");*/

		socket.on('initialization', function () {
			var user = (session.user) ? session.user.publics : {},
				currentChannel = (session.currentChannel) ? session.currentChannel : sessionID,
				chatName = session.chatName,
				chatEmail = session.chatEmail,
				chatPhone = session.chatPhone;
			Chat.listChannels.call(NA, function (channels) {
				socket.emit('initialization', sessionID, user, {
					currentChannel: currentChannel,
					chatName: chatName,
					chatEmail: chatEmail,
					chatPhone: chatPhone,
					chatChannels: channels
				});
			});
		});

		socket.on('disconnect', function() {
			var index = NA.sockets.indexOf(socket),
				removed = true,
				sessionID = socket.request.sessionID;

			NA.sockets.splice(index, 1);
			/*console.log("====================");
			console.log('Disconnect!');*/
			NA.sockets.forEach(function (item) {
				//console.log(item.id, item.request.sessionID);
				if (item.request.sessionID === sessionID) {
					removed = false;
				}
			});
			//console.log("====================");

			if (removed) {
				Chat.sleepChannel.call(NA, sessionID, false, function (channel) {
					socket.broadcast.emit('chat--sleep-channel', channel);
				});
			}
		});

		require(path.join(NA.serverPath, NA.webconfig.controllersRelativePath, "modules/chat.js")).sockets.call(NA, socket, session, sessionID);
	});
};