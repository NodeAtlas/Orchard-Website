/* jshint node: true, esversion: 6 */
/* global NA */
module.exports = function (common, template, router, webconfig) {

	return {
		template: template,
		router: router,
		data: {
			common: common,
			chat: {
				messages: [],
				channels: [],
				currentChannel: undefined,
				state: undefined,
				isInit: false,
				message: "",
				enterState: true,
				name: "",
				email: undefined,
				phone: undefined,
				nameExist: undefined,
				emailExist: undefined,
				phoneExist: undefined
			},
			webconfig: webconfig
		},
		methods: {
			changeChannel: function (channel) {
				this.chat.currentChannel = channel;
				NA.socket.emit('chat--change-channel', this.chat.currentChannel);
				NA.socket.once('chat--change-channel', (messages) => {
					this.chat.messages = messages;
					window.scrollToBottom(this);
				});
			},
			removeChannel: function (channel) {
				NA.socket.emit('chat--remove-channel', channel);
			},
			toggleChat: function () {
				this.chat.state = !this.chat.state;
				window.scrollToBottom(this);
				if (!this.chat.isInit) {
					this.chat.isInit = true;
					NA.socket.emit('chat--init-message', this.chat.currentChannel);
					NA.socket.once('chat--init-message', (messages, channels) => {
						this.chat.channels = channels;
						this.chat.channels.sort(window.sortChannels);
						this.chat.messages = messages;
						window.scrollToBottom(this);
					});
				}
			},
			sendMessage: function () {
				if (this.chat.enterState) {
					this.chat.message = this.chat.message.replace(/\n|\r/g, "");
				} else {
					this.chat.message = this.chat.message.replace(/\n|\r/g, "<br>");
				}
				if (this.chat.message) {
					NA.socket.emit('chat--send-message', this.chat.name, this.chat.message, this.chat.currentChannel);
					NA.socket.once('chat--send-message', () => {
						window.scrollToBottom(this);
						this.chat.message = "";
					});
				}
			},
			sendName: function () {
				this.chat.name = this.chat.name.replace(/\n|\r/g, "");
				if (this.chat.name) {
					NA.socket.emit('chat--send-name', this.chat.name, this.chat.currentChannel);
				}
			},
			sendEmail: function () {
				if (this.chat.email || this.chat.phone) {
					NA.socket.emit('chat--send-email', this.chat.email, this.chat.phone, this.chat.currentChannel);
				}
			}
		}
	};
};