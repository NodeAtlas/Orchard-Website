/* jshint node: true, esversion: 6 */
/* global NA, Vue */
module.exports = function (template) {
	return {
		name: "chat",
		props: ['common', 'global'],
		template: template,
		data: function () {
			return {
				chat: {
					isInit: false,
					message: "",
					enterState: true,
					alertDeleteChannel: false
				}
			};
		},
		methods: {
			changeChannel: function (channel) {
				this.global.chat.currentChannel = channel;
				NA.socket.emit('chat--change-channel', this.global.chat.currentChannel);
				NA.socket.once('chat--change-channel', (messages) => {
					this.global.chat.messages = messages;
					window.scrollToBottom(this);
				});
			},
			removeChannel: function (channel) {
				NA.socket.emit('chat--remove-channel', channel);
			},
			isMoved: function () {
				var currentStyle = getComputedStyle(this.$el);
				this.xPosition = currentStyle.left;
				this.yPosition = currentStyle.top;
			},
			toggleChat: function () {
				var currentStyle = getComputedStyle(this.$el);

				//this.$el.dispatchEvent(new Event("touchmove"));
				//this.$el.dispatchEvent(new Event("mousemove"));

				if (
					currentStyle.left === this.xPosition &&
					currentStyle.top === this.yPosition
				   ) {
					this.global.chat.state = !this.global.chat.state;
					if (!this.chat.isInit) {
						this.chat.isInit = true;
						NA.socket.emit('chat--init-message', this.global.chat.currentChannel);
						NA.socket.once('chat--init-message', (messages, channels) => {
							this.global.chat.channels = channels;
							this.global.chat.channels.sort(window.sortChannels);
							this.global.chat.messages = messages;
							window.scrollToBottom(this);
						});
					}
				}
				Vue.nextTick(() => {
					window.scrollToBottom(this);
				});
			},
			sendMessage: function () {
				if (this.chat.enterState) {
					this.chat.message = this.chat.message.replace(/\n|\r/g, "");
				} else {
					this.chat.message = this.chat.message.replace(/\n|\r/g, "<br>");
				}
				if (this.chat.message) {
					NA.socket.emit('chat--send-message', this.global.chat.name, this.chat.message, this.global.chat.currentChannel);
					NA.socket.once('chat--send-message', () => {
						window.scrollToBottom(this);
						this.chat.message = "";
					});
				}
			},
			sendName: function () {
				this.global.chat.name = this.global.chat.name.replace(/\n|\r/g, "");
				if (this.global.chat.name) {
					NA.socket.emit('chat--send-name', this.global.chat.name, this.global.chat.currentChannel);
				}
			},
			sendEmail: function () {
				if (this.global.chat.email || this.global.chat.phone) {
					NA.socket.emit('chat--send-email', this.global.chat.email, this.global.chat.phone, this.global.chat.currentChannel);
				}
			}
		}
	};
};