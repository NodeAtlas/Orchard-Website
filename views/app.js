/* jshint node: true, esversion: 6 */
/* global NA, Vue */
module.exports = function (common, template, router, webconfig) {
	function scrollToBottom(vm) {
		var area = document.getElementsByClassName("chat--messagebox")[0];
		if (area && vm.chat.state) {
			Vue.nextTick(function () {
				area.scrollTop = area.scrollHeight;
			});
		}
	}

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
				name: undefined,
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
					scrollToBottom(this);
				});
			},
			removeChannel: function (channel) {
				NA.socket.emit('chat--remove-channel', channel);
			},
			toggleChat: function () {
				var startChannel = this.chat.currentChannel;
				this.chat.state = !this.chat.state;
				scrollToBottom(this);
				if (!this.chat.isInit) {
					this.chat.isInit = true;
					NA.socket.emit('chat--init-message', this.chat.currentChannel);
					NA.socket.once('chat--init-message', (messages, channels) => {
						this.chat.channels = channels;
						this.chat.channels.sort((a, b) => a > b);
						this.chat.messages = messages;
						scrollToBottom(this);
					});
					if (!this.chat.name && !common.me.id) {
						setTimeout(() => {
							NA.socket.emit('chat--send-message', "Posez vos questions et quelqu'un viendra y répondre !", startChannel, 'message');
							setTimeout(() => {
								scrollToBottom(this);
							}, 200);
						}, 8000);
						setTimeout(() => {
							NA.socket.emit('chat--send-message', "Comment vous appelez-vous ?", startChannel, 'name');
							setTimeout(() => {
								scrollToBottom(this);
							}, 200);
						}, 16000);
						setTimeout(() => {
							NA.socket.emit('chat--send-message', "La réponse tarde un peu. Vous pouvez nous laisser votre adresse email ou votre numéro de téléphone pour être recontacté.", startChannel, 'email');
							setTimeout(() => {
								scrollToBottom(this);
							}, 200);
						}, 60000);
					}
				}
			},
			sendMessage: function () {
				if (this.chat.enterState) {
					this.chat.message = this.chat.message.replace(/\n|\r/g, "");
				} else {
					this.chat.message = this.chat.message.replace(/\n|\r/g, "<br>");
				}
				if (this.chat.message) {
					NA.socket.emit('chat--send-message', this.chat.message, this.chat.currentChannel);
					NA.socket.once('chat--send-message', () => {
						scrollToBottom(this);
						this.chat.message = "";
					});
				}
			},
			sendName: function () {
				this.chat.name = this.chat.name.replace(/\n|\r/g, "");
				if (this.chat.name) {
					NA.socket.emit('chat--send-name', this.chat.name, this.chat.currentChannel);
					NA.socket.once('chat--send-name', (name) => {
						this.chat.nameExist = name;
					});
				}
			},
			sendEmail: function () {
				if (this.chat.email || this.chat.phone) {
					NA.socket.emit('chat--send-email', this.chat.email, this.chat.phone, this.chat.currentChannel);
					NA.socket.once('chat--send-email', (email, phone) => {
						this.chat.emailExist = email;
						this.chat.phoneExist = phone;
					});
				}
			}
		}
	};
};