/* jshint node: true, esversion: 6 */
/* global NA */
module.exports = function (vm) {

	NA.socket.on('chat--send-message', function (message, currentChannel) {
		if (currentChannel === vm.chat.currentChannel) {
			vm.chat.messages.push(message);
		}
		window.scrollToBottom(vm);
	});

	NA.socket.on('chat--send-name', function (name, channel) {
		vm.chat.nameExist = name;
		vm.chat.channels.forEach(function (current, index) {
			if (current.name === channel.name) {
				vm.chat.channels.splice(index, 1);
			}
		});
		vm.chat.channels.push(channel);
		vm.chat.channels.sort(window.sortChannels);
	});

	NA.socket.on('chat--send-email', function (email, phone) {
		vm.chat.emailExist = email;
		vm.chat.phoneExist = phone;
	});

	NA.socket.on('chat--send-channel', function (channel) {
		vm.chat.channels.forEach(function (current, index) {
			if (current.name === channel.name) {
				vm.chat.channels.splice(index, 1);
			}
		});
		vm.chat.channels.push(channel);
		vm.chat.channels.sort(window.sortChannels);
	});

	NA.socket.on('chat--sleep-channel', function (channel) {
		if (channel) {
			vm.chat.channels.forEach(function (current, index) {
				if (channel.name === current.name) {
					vm.chat.channels.splice(index, 1);
				}
			});
		}
		vm.chat.channels.push(channel);
		vm.chat.channels.sort(window.sortChannels);
	});

	NA.socket.on('chat--remove-channel', function (channel) {
		var labelChannel = channel.substring(0, 8),
			labelNextChannel;

		vm.chat.channels.forEach(function (current, index) {
			if (current.name === channel) {
				vm.chat.channels.splice(index, 1);
			}
		});
		labelNextChannel = vm.chat.channels[0].name.substring(0, 8);
		if (vm.chat.currentChannel === channel) {
			alert(`La discussion ${labelChannel} a été fermée. Vous êtes maintenant avec ${labelNextChannel}.`);
			vm.changeChannel(vm.chat.channels[0].name);
		}

		window.scrollToBottom(vm);
		vm.chat.channels.sort(window.sortChannels);
	});
};