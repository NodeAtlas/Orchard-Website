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
		Chat.changeName.call(NA, name, currentChannel, function (name, channel) {
			io.emit('chat--send-name', name, channel);
			setTimeout(function () {
				Chat.addMessage.call(NA, "", "Bonjour " + name + ", dites nous tout.", currentChannel, 'message', undefined, function (message) {
					io.emit('chat--send-message', message, currentChannel);
				});
			}, 3000);
		});
	});

	socket.on('chat--send-email', function (email, phone, currentChannel) {
		session.chatEmail = email;
		session.chatPhone = phone;
		session.touch().save();
		Chat.changeEmail.call(NA, email, phone, currentChannel, function (email, phone) {
			io.emit('chat--send-email', email, phone);
			setTimeout(function () {
				Chat.addMessage.call(NA, "", "Votre email " + email + " et/ou votre numéro " + phone + " resteront confidentiels.", currentChannel, 'message', undefined, function (message) {
					io.emit('chat--send-message', message, currentChannel);
				});
			}, 5000);
		});
	});

	socket.on('chat--sleep-channel', function (sessionID, state) {
		Chat.sleepChannel.call(NA, sessionID, state, function (channel) {
			io.emit('chat--sleep-channel', channel);
		});
	});

	socket.on('chat--init-message', function (currentChannel) {
		Chat.addChannel.call(NA, sessionID, NA.sockets, function (channel) {
			Chat.listChannels.call(NA, function (channels) {
				Chat.listMessage.call(NA, currentChannel, function (messages) {
					socket.emit('chat--init-message', messages, channels);
					socket.broadcast.emit('chat--send-channel', channel);

					if (!session.isStarted) {
						setTimeout(function () {
							Chat.addMessage.call(NA, "", "Posez vos questions et quelqu'un viendra y répondre !", sessionID, 'message', undefined, function (message) {
								io.emit('chat--send-message', message, sessionID);
							});
						}, 8000);

						setTimeout(function () {
							Chat.addMessage.call(NA, "", "Comment vous appelez-vous ?", sessionID, 'name', undefined, function (message) {
								io.emit('chat--send-message', message, sessionID);
							});
						}, 16000);

						setTimeout(function () {
							Chat.addMessage.call(NA, "", "Si vous ne pouvez pas attendre plus longtemps, vous pouvez nous laisser votre adresse email ou votre numéro de téléphone pour être recontacté.", sessionID, 'email', undefined, function (message) {
								io.emit('chat--send-message', message, sessionID);
							});
						}, 60000);
					}
					session.isStarted = true;
					session.touch().save();
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

	socket.on('chat--send-message', function (name, message, currentChannel, special) {
		var user = (session.user) ? session.user.publics.firstname : name;
		Chat.addMessage.call(NA, user, message, currentChannel, special, (session.user && session.user.publics.firstname), function (message) {
			io.emit('chat--send-message', message, currentChannel);
		});
	});
};