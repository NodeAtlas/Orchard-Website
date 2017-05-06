/* jshint node: true, esversion: 6 */
/* global NA */
exports.setSockets = function (vm) {
	NA.socket.emit('chat--init');

	NA.socket.on('chat--init', function (chat) {
		vm.global.chat.channels = chat.chatChannels;
		vm.global.chat.channels.sort(window.sortChannels);
		vm.global.chat.currentChannel = chat.currentChannel;
		vm.global.chat.name = chat.chatName;
		vm.global.chat.nameExist = chat.chatName;
		vm.global.chat.email = chat.chatEmail;
		vm.global.chat.emailExist = chat.chatEmail;
		vm.global.chat.phone = chat.chatPhone;
		vm.global.chat.phoneExist = chat.chatPhone;
	});

	NA.socket.on('chat--send-message', function (message, currentChannel) {
		if (currentChannel === vm.global.chat.currentChannel) {
			vm.global.chat.messages.push(message);
		}
		window.scrollToBottom(vm);
	});

	NA.socket.on('chat--send-name', function (name, channel) {
		vm.global.chat.nameExist = name;
		vm.global.chat.channels.forEach(function (current, index) {
			if (current.name === channel.name) {
				vm.global.chat.channels.splice(index, 1);
			}
		});
		vm.global.chat.channels.push(channel);
		vm.global.chat.channels.sort(window.sortChannels);
	});

	NA.socket.on('chat--send-email', function (email, phone) {
		vm.global.chat.emailExist = email;
		vm.global.chat.phoneExist = phone;
	});

	NA.socket.on('chat--send-channel', function (channel) {
		if (vm.global.chat.state) {
			vm.global.chat.channels.forEach(function (current, index) {
				if (current.name === channel.name) {
					vm.global.chat.channels.splice(index, 1);
				}
			});
			vm.global.chat.channels.push(channel);
			vm.global.chat.channels.sort(window.sortChannels);
		}
	});

	NA.socket.on('chat--sleep-channel', function (channel) {
		if (channel) {
			vm.global.chat.channels.forEach(function (current, index) {
				if (channel.name === current.name) {
					vm.global.chat.channels.splice(index, 1);
				}
			});
		}
		vm.global.chat.channels.push(channel);
		vm.global.chat.channels.sort(window.sortChannels);
	});

	NA.socket.on('chat--remove-channel', function (channel) {
		var labelChannel = channel.substring(0, 8),
			labelNextChannel;

		vm.global.chat.channels.forEach(function (current, index) {
			if (current.name === channel) {
				vm.global.chat.channels.splice(index, 1);
			}
		});
		labelNextChannel = vm.global.chat.channels[0].name.substring(0, 8);
		if (vm.global.chat.currentChannel === channel) {
			vm.common.chat.admin.removeAlert.message = window.replaceData(vm.common.chat.admin.removeAlert.message, {
				labelChannel: labelChannel,
				labelNextChannel: labelNextChannel
			});
			vm.$refs.chat.chat.alertDeleteChannel = true;
			vm.$refs.chat.changeChannel(vm.global.chat.channels[0].name);
		}

		window.scrollToBottom(vm);
		vm.global.chat.channels.sort(window.sortChannels);
	});
};