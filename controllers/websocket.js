/* jshint node: true */
exports.setSockets = function () {
	var NA = this,
		io = NA.io;

	io.sockets.on("connection", function (socket) {
        socket.on("websocket", function (data) {
        	console.log(data.str);
            io.sockets.emit("websocket", data);
        });
    });
};