/* jshint node: true */
exports.setSockets = function () {
	var NA = this,
		io = NA.io/*,
		Edit = NA.models.Edit*/;

	io.on('connection', function (socket) {
		/*var session = socket.request.session,
			sessionID = socket.request.sessionID;*/

		socket.on('edit--save', function (file, json) {
			socket.emit('edit--save');
			socket.broadcast.emit('edit--save', file, json);
		});
	});
};