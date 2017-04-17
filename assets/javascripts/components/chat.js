/* jshint node: true, esversion: 6 */
/* global NA */
module.exports = function (vm) {

	NA.socket.emit('chat--init');

	NA.socket.on('chat--init', function (chat) {
		vm.common.chat.channels = chat.chatChannels;
		vm.common.chat.channels.sort(window.sortChannels);
		vm.common.chat.currentChannel = chat.currentChannel;
		vm.common.chat.name = chat.chatName;
		vm.common.chat.nameExist = chat.chatName;
		vm.common.chat.email = chat.chatEmail;
		vm.common.chat.emailExist = chat.chatEmail;
		vm.common.chat.phone = chat.chatPhone;
		vm.common.chat.phoneExist = chat.chatPhone;
	});

	NA.socket.on('chat--send-message', function (message, currentChannel) {
		if (currentChannel === vm.common.chat.currentChannel) {
			vm.common.chat.messages.push(message);
		}
		window.scrollToBottom(vm);
	});

	NA.socket.on('chat--send-name', function (name, channel) {
		vm.common.chat.nameExist = name;
		vm.common.chat.channels.forEach(function (current, index) {
			if (current.name === channel.name) {
				vm.common.chat.channels.splice(index, 1);
			}
		});
		vm.common.chat.channels.push(channel);
		vm.common.chat.channels.sort(window.sortChannels);
	});

	NA.socket.on('chat--send-email', function (email, phone) {
		vm.common.chat.emailExist = email;
		vm.common.chat.phoneExist = phone;
	});

	NA.socket.on('chat--send-channel', function (channel) {
		if (vm.common.chat.state) {
			vm.common.chat.channels.forEach(function (current, index) {
				if (current.name === channel.name) {
					vm.common.chat.channels.splice(index, 1);
				}
			});
			vm.common.chat.channels.push(channel);
			vm.common.chat.channels.sort(window.sortChannels);
		}
	});

	NA.socket.on('chat--sleep-channel', function (channel) {
		if (channel) {
			vm.common.chat.channels.forEach(function (current, index) {
				if (channel.name === current.name) {
					vm.common.chat.channels.splice(index, 1);
				}
			});
		}
		vm.common.chat.channels.push(channel);
		vm.common.chat.channels.sort(window.sortChannels);
	});

	NA.socket.on('chat--remove-channel', function (channel) {
		var labelChannel = channel.substring(0, 8),
			labelNextChannel;

		vm.common.chat.channels.forEach(function (current, index) {
			if (current.name === channel) {
				vm.common.chat.channels.splice(index, 1);
			}
		});
		labelNextChannel = vm.common.chat.channels[0].name.substring(0, 8);
		if (vm.common.chat.currentChannel === channel) {
			alert(`La discussion ${labelChannel} a été fermée. Vous êtes maintenant avec ${labelNextChannel}.`);
			console.log(vm.$children[1].changeChannel);
			vm.$children[1].changeChannel(vm.common.chat.channels[0].name);
		}

		window.scrollToBottom(vm);
		vm.common.chat.channels.sort(window.sortChannels);
	});
};