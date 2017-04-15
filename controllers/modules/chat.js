/* jshint node: true */
exports.sockets = function (socket, session, sessionID) {
	var NA = this,
		io = NA.io,
		Chat = NA.models.Chat;

	socket.on('chat--change-state', function (state) {
		session.chatState = state;
		session.touch().save();
	});

	socket.on('chat--send-name', function (name, currentChannel) {
		session.chatName = name;
		session.touch().save();
		Chat.changeName.call(NA, name, currentChannel, function (name) {
			socket.emit('chat--send-name', name);
			Chat.addMessage.call(NA, "", name, currentChannel, undefined, function (message) {
				io.emit('chat--send-message', message, currentChannel);
				setTimeout(function () {
					Chat.addMessage.call(NA, "", "Bonjour " + name + ", dites nous.", currentChannel, 'message', function (message) {
						io.emit('chat--send-message', message, currentChannel);
					});
				}, 3000);
			});
		});
	});

	socket.on('chat--send-email', function (email, phone, currentChannel) {
		session.chatEmail = email;
		session.chatPhone = phone;
		session.touch().save();
		Chat.changeEmail.call(NA, email, phone, currentChannel, function (email, phone) {
			socket.emit('chat--send-email', email, phone);
			Chat.addMessage.call(NA, "", email + " " + phone, currentChannel, undefined, function (message) {
				io.emit('chat--send-message', message, currentChannel);
			});
		});
	});

	socket.on('chat--init-message', function (currentChannel) {
		Chat.addChannel.call(NA, sessionID, NA.sockets, function (channel) {
			Chat.listChannels.call(NA, function (channels) {
				Chat.listMessage.call(NA, currentChannel, function (messages) {
					socket.emit('chat--init-message', messages, channels);
					socket.broadcast.emit('chat--send-channel', channel);
				});
			});
		});
	});

	socket.on('chat--change-channel', function (currentChannel) {
		Chat.listMessage.call(NA, currentChannel, function (messages) {
			if (session.user) {
				session.currentChannel = currentChannel;
				session.touch().save();
				socket.emit('chat--change-channel', messages);
			}
		});
	});

	socket.on('chat--remove-channel', function (channel) {
		Chat.removeChannel.call(NA, channel, function () {
			io.emit('chat--remove-channel', channel);
		});
	});

	socket.on('chat--send-message', function (message, currentChannel, special) {
		var user = (session.user) ? session.user.publics.firstname : "";
		Chat.addMessage.call(NA, user, message, currentChannel, special, function (message) {
			io.emit('chat--send-message', message, currentChannel);
		});
	});
};