/* jshint node: true, esversion: 6 */
/* global NA */
module.exports = function (common, template, router, webconfig) {
	var chat = {
		props: ['common'],
		template: `<aside class="chat" data-name="Moi">
			<div v-if="common.chat.state" class="chat--chatbox">
				<header class="chat--overview">
					<h1>Orchard Instant Discussion</h1>
					<p>Posez vos questions ici et nous répondrons avant la fin de votre épisode de Game of Thrones</p>
				</header>
				<div v-if="common.me.id" class="chat--channelbox">
					<h2>Toutes les conversations</h2>
					<ul>
						<li v-for="channel in common.chat.channels" class="chat--channel" v-bind:class="{ 'is-active': channel.state, 'is-current': common.chat.currentChannel === channel.name }">
							<span v-on:click="changeChannel(channel.name)" class="chat--channelbox--state">{{ (common.me.firstname && common.sessionID === channel.name) ? common.me.firstname : ((channel.user) ? channel.user : channel.name.substring(0, 8)) }}</span>
							<span class="chat--channelbox--remove" v-if="!channel.state" v-on:click="removeChannel(channel.name)">X</span>
						</li>
					</ul>
					<h2 v-if="common.sessionID === common.chat.currentChannel">C'est vous ({{ common.chat.currentChannel.substring(0, 8) }}) !</h2>
					<h3 v-else>Session : {{ common.chat.currentChannel.substring(0, 8) }}</h3>
				</div>
				<div class="chat--messagebox">
					<div v-if="common.chat.messages.length > 0">
						<ul>
							<li v-for="message in common.chat.messages" class="chat--message" v-bind:class="{ 'is-reversed': !message.auth && !message.special }">
								<time v-html="message.date"></time>
								<div class="chat--user">{{ (message.special) ? "Orchard ID" : ((message.user) ? message.user : (common.chat.name) ? common.chat.name : common.meName) }}</div>
								<div v-html="message.message"></div>
								<div class="chat--special" v-if="message.special === 'name' && !common.chat.nameExist && !common.me.id">
									<input v-on:keyup.enter="sendName" placeholder="Votre prénom" v-model="common.chat.name" type="text">
									<button v-on:click="sendName">Valider</button>
								</div>
								<div class="chat--special" v-if="message.special === 'email' && !common.chat.emailExist && !common.me.id">
									<input placeholder="Votre email" v-model="common.chat.email" type="text"> et/ou
									<input placeholder="Votre numéro" v-model="common.chat.phone" type="text">
									<button v-on:click="sendEmail">Valider</button>
								</div>
							</li>
						</ul>
					</div>
					<div v-else>
						<p>Écrivez pour démarrer la discussion</p>
					</div>
				</div>
				<footer class="chat--sendbox">
					<div class="chat--sendarea">
						<p>
							<span v-if="chat.enterState" class="chat--typearea">
								<input v-on:keyup.enter="sendMessage" v-model="chat.message" placeholder="Écrire ici..." id="chat--textarea" class="chat--textarea">
							</span>
							<span v-else class="chat--typearea">
								<textarea v-model="chat.message" placeholder="Écrire ici..." id="chat--textarea" class="chat--textarea"></textarea>
							</span>
							<button v-on:click="sendMessage" class="chat--sendbox--controls--reply">Envoyer</button>
						</p>
					</div>
					<div class="chat--sendbox--controls">

						<div class="chat--sendbox--controls--options">
							<label for="chat--sendbox--controls--withenter">
								<input v-model="chat.enterState" type="checkbox" name="withenter" id="chat--sendbox--controls--withenter" class="chat--sendbox--controls--withenter">
								Appuyer sur <strong>Entrer</strong> pour envoyer
							</label>
						</div>
					</div>
				</footer>
			</div>
			<button v-on:click="toggleChat" class="chat--start">
				<span v-if="!common.chat.state">Une question ?</span>
				<span v-else>Fermer</span>
			</button>
		</aside>`,
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

	return {
		name: 'App',
		template: template,
		router: router,
		components: {
			'chat': chat
		},
		data: {
			common: Object.assign({}, common, {
				me: {},
				sessionID: "",
				chat: {
					messages: [],
					state: undefined,
					channels: [],
					currentChannel: undefined,
					name: "",
					email: undefined,
					phone: undefined,
					nameExist: undefined,
					emailExist: undefined,
					phoneExist: undefined
				}
			}),
			webconfig: webconfig
		}
	};
};