/* jshint node: true, esversion: 6 */
exports.setModules = function () {
	var NA = this;

	NA.models = {};
	NA.models.User = require("../models/connectors/user.js");
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
		app = path.join(NA.serverPath, NA.webconfig.viewsRelativePath, "app.htm"),
		specific = locals.specific;

	global.Vue = Vue;
	Vue.use(VueRouter);

	fs.readFile(view, "utf-8",  function (error, template) {
		var component = Vue.component('all', require(model)(specific, template));
		fs.readFile(app, "utf-8", function (error, template) {
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
				stream = renderer.renderToStream(new Vue({
					template: template,
					router: router,
					data: {
						common: locals.common,
						webconfig: {
							routes: NA.webconfig.routes
						}
					}
				}));

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
        io = NA.io;

    NA.sockets = [];

	io.on('connection', function (socket) {
        var session = socket.request.session;

	    debug(NA, socket);

        socket.on('initialization', function () {
        	if (session.user) {
                socket.emit('initialization', session.user.publics);
            }
        });

    });
};

function debug(NA, socket) {
	NA.sockets.push(socket);
    console.log("====================");
    console.log('Connect!');
    NA.sockets.forEach(function (item) {
        console.log(item.id, item.request.sessionID);
    });
    console.log("====================");

	socket.on('disconnect', function() {
        var index = NA.sockets.indexOf(socket);
            
        NA.sockets.splice(index, 1);
        console.log("====================");
        console.log('Disconnect!');
        NA.sockets.forEach(function (item) {
            console.log(item.id, item.request.sessionID);
        });
        console.log("====================");
    });
}