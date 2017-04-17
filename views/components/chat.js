/* jshint node: true, esversion: 6 */
/* global NA */
module.exports = function (common, template) {
	return {
		name: "chat",
		props: ['common'],
		template: template,
		data: function () {
			return {
				chat: {
					isInit: false,
					message: "",
					enterState: true
				}
			};
		},
		methods: {
			changeChannel: function (channel) {
				this.common.chat.currentChannel = channel;
				NA.socket.emit('chat--change-channel', this.common.chat.currentChannel);
				NA.socket.once('chat--change-channel', (messages) => {
					this.common.chat.messages = messages;
					window.scrollToBottom(this);
				});
			},
			removeChannel: function (channel) {
				NA.socket.emit('chat--remove-channel', channel);
			},
			toggleChat: function () {
				this.common.chat.state = !this.common.chat.state;
				window.scrollToBottom(this);
				if (!this.chat.isInit) {
					this.chat.isInit = true;
					NA.socket.emit('chat--init-message', this.common.chat.currentChannel);
					NA.socket.once('chat--init-message', (messages, channels) => {
						this.common.chat.channels = channels;
						this.common.chat.channels.sort(window.sortChannels);
						this.common.chat.messages = messages;
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
					NA.socket.emit('chat--send-message', this.common.chat.name, this.chat.message, this.common.chat.currentChannel);
					NA.socket.once('chat--send-message', () => {
						window.scrollToBottom(this);
						this.chat.message = "";
					});
				}
			},
			sendName: function () {
				this.common.chat.name = this.common.chat.name.replace(/\n|\r/g, "");
				if (this.common.chat.name) {
					NA.socket.emit('chat--send-name', this.common.chat.name, this.common.chat.currentChannel);
				}
			},
			sendEmail: function () {
				if (this.common.chat.email || this.common.chat.phone) {
					NA.socket.emit('chat--send-email', this.common.chat.email, this.common.chat.phone, this.common.chat.currentChannel);
				}
			}
		}
	};
};