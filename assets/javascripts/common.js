/* jshint browser: true, esversion: 6 */
/* global NA, ga, Vue, VueRouter, require */

var ua = document.body.getAttribute('data-ua'),
	lang = document.getElementsByTagName("html")[0].getAttribute("lang"),
	template = require("views-models/app.htm!text"),
	model = require("views-models/app.js"),
	common = require("variations/common.json!json"),
	webconfig = {
		routes: require("routes.json!json")
	},
	mixin = {
		beforeRouteEnter: function (to, from, next) {
			next(function (vm) {
				document.title = vm.meta.title;
				if (ua) {
					ga('send', 'pageview', to.path, {
						title: vm.meta.title,
						location: location.href,
						page: to.path
					});
				}
			});
		}
	},
	vmHome = Vue.component('home', function (resolve) {
		var template = require("views-models/home.htm!text"),
			specific = require("variations/home.json!json");
		resolve(require('views-models/home.js')(specific, template, mixin));
	}),
	vmLogin = Vue.component('login', function (resolve) {
		var template = require("views-models/login.htm!text"),
			specific = require("variations/login.json!json");
		resolve(require('views-models/login.js')(specific, template, mixin));
	}),
	vmError = Vue.component('error', function (resolve) {
		var template = require("views-models/error.htm!text"),
			specific = require("variations/error.json!json");
		resolve(require('views-models/error.js')(specific, template, mixin));
	}),
	router = new VueRouter({
		mode: 'history',
		base: '/',
		routes: [{
			path: webconfig.routes["home_" + lang].url,
			component: vmHome,
			props: ['common']
		}, {
			path: webconfig.routes["login_" + lang].url,
			component: vmLogin,
			props: ['common', 'me']
		}, {
			path: '/*',
			component: vmError,
			props: ['common']
		}]
	}),
	vm;

if (ua) {
	ga('create', ua, 'auto');
}

vm = new Vue(model(common, template, router, webconfig));

vm.$mount('.layout');

NA.socket.emit('initialization');
NA.socket.on('initialization', function (me, chat) {
	vm.common.me = me;
	vm.chat.currentChannel = chat.currentChannel;
	vm.chat.nameExist = chat.chatName;
	vm.chat.name = chat.chatName;
	vm.chat.emailExist = chat.chatEmail;
	vm.chat.email = chat.chatEmail;
	vm.chat.phoneExist = chat.chatPhone;
	vm.chat.phone = chat.chatPhone;
});

require("javascripts/chat.js")(vm);