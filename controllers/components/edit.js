/* jshint node: true */
exports.setSockets = function () {
	var NA = this,
		io = NA.io,
		Edit = NA.models.Edit;

	io.on('connection', function (socket) {
		var session = socket.request.session;

		socket.on('edit--save', function (file, json) {
			if (session.user) {
				Edit.save.call(NA, file, json, function () {
					socket.emit('edit--save');
					socket.broadcast.emit('edit--save', file, json);
				});
			}
		});
	});
};