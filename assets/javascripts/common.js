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

window.scrollToBottom = function (vm) {
	var area = document.getElementsByClassName("chat--messagebox")[0];
	if (area && vm.chat.state) {
		Vue.nextTick(function () {
			area.scrollTop = area.scrollHeight;
		});
	}
};

window.sortChannels = function (a, b) {
	return (a && a.name) > (b && b.name);
};

if (ua) {
	ga('create', ua, 'auto');
}

vm = new Vue(model(common, template, router, webconfig));

vm.$mount('.layout');

NA.socket.emit('app--init');

NA.socket.on('app--init', function (sessionID, me) {
	vm.common.me = me;
	vm.common.sessionID = sessionID;
});

require("javascripts/components/chat.js")(vm);