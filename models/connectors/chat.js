/* globals exports */
exports.addMessage = function (user, phrase, file, special, next) {
	var NA = this,
		fs = NA.modules.fs,
		path = NA.modules.path,
		pathfile = path.join(NA.serverPath, "data/chat/" + file + ".json");

	fs.readFile(pathfile, "utf-8", function (err, result) {
		var content = { messages: [] },
			message;

		if (result) {
			content = JSON.parse(result);
		}

		message = {
			user: user,
			message: phrase,
			special: special,
			date: (+new Date())
		};

		content.messages.push(message);

		fs.writeFile(pathfile, JSON.stringify(content, undefined, '    '), function () {
			next(message);
		});
	});
};

exports.changeName = function (name, file, next) {
	var NA = this,
		fs = NA.modules.fs,
		path = NA.modules.path,
		pathfile = path.join(NA.serverPath, "data/chat/" + file + ".json");

	fs.readFile(pathfile, "utf-8", function (err, result) {
		var content = JSON.parse(result);

		content.name = name;

		fs.writeFile(pathfile, JSON.stringify(content, undefined, '    '), function () {
			next(name);
		});
	});
};

exports.changeEmail = function (email, phone, file, next) {
	var NA = this,
		fs = NA.modules.fs,
		path = NA.modules.path,
		pathfile = path.join(NA.serverPath, "data/chat/" + file + ".json");

	fs.readFile(pathfile, "utf-8", function (err, result) {
		var content = JSON.parse(result);

		content.email = email;
		content.phone = phone;

		fs.writeFile(pathfile, JSON.stringify(content, undefined, '    '), function () {
			next(email, phone);
		});
	});
};

exports.addChannel = function (session, sessions, next) {
	var NA = this,
		fs = NA.modules.fs,
		path = NA.modules.path,
		pathfile = path.join(NA.serverPath, "data/channels.json");

	fs.readFile(pathfile, "utf-8", function (err, result) {
		var content = { channels: [] },
			channel,
			isExist = false,
			isLeft;

		if (result) {
			content = JSON.parse(result);
		}

		channel = {
			name: session,
			state: true,
			date: (+new Date())
		};

		content.channels.forEach(function (channel) {
			isLeft = true;

			sessions.forEach(function (session) {
				if (session.request.sessionID === channel.name) {
					isLeft = false;
					return;
				}
			});

			if (isLeft) {
				channel.state = false;
			}

			if (channel.name === session) {
				isExist = true;
				channel.state = true;
				channel.date = (+new Date());
			}
		});

		if (!isExist) {
			content.channels.push(channel);
		}

		fs.writeFile(pathfile, JSON.stringify(content, undefined, '    '), function () {
			next(channel);
		});
	});
};

exports.removeChannel = function (session, next) {
	var NA = this,
		fs = NA.modules.fs,
		path = NA.modules.path,
		pathfile = path.join(NA.serverPath, "data/channels.json");

	fs.readFile(pathfile, "utf-8", function (err, result) {
		var content = { channels: [] };

		if (result) {
			content = JSON.parse(result);
		}

		content.channels.forEach(function (channel, index) {
			if (channel.name === session) {
				content.channels.splice(index, 1);
				return;
			}
		});

		fs.unlink("data/chat/" + session + ".json", function () {
			fs.writeFile(pathfile, JSON.stringify(content, undefined, '    '), function () {
				next();
			});
		});
	});
};

exports.sleepChannel = function (session, next) {
	var NA = this,
		fs = NA.modules.fs,
		path = NA.modules.path,
		pathfile = path.join(NA.serverPath, "data/channels.json");

	fs.readFile(pathfile, "utf-8", function (err, result) {
		var content = { channels: [] },
			channel;

		if (result) {
			content = JSON.parse(result);
		}

		content.channels.forEach(function (current) {
			if (current.name === session) {
				current.state = false;
				current.date = (+new Date());
				channel = current;
			}
		});

		fs.writeFile(pathfile, JSON.stringify(content, undefined, '    '), function () {
			next(channel);
		});
	});
};

exports.listChannels = function (next) {
	var NA = this,
		fs = NA.modules.fs,
		path = NA.modules.path,
		pathfile = path.join(NA.serverPath, "data/channels.json");

	fs.readFile(pathfile, "utf-8", function (err, result) {
		var content = { channels: [] };
		if (result) {
			content = JSON.parse(result);
		}

		next(content.channels);
	});
};

exports.listMessage = function (file, next) {
	var NA = this,
		fs = NA.modules.fs,
		path = NA.modules.path,
		pathfile = path.join(NA.serverPath, "data/chat/" + file + ".json");

	fs.readFile(pathfile, "utf-8", function (err, result) {
		var content = { messages: [] };
		if (result) {
			content = JSON.parse(result);
		}

		next(content.messages);
	});
};