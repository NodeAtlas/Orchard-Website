/* jshint browser: true */
/* global NA, ga, Vue, VueRouter, require */

var ua = document.body.getAttribute('data-ua'),
	lang = document.getElementsByTagName("html")[0].getAttribute("lang"),
	routes = JSON.parse(document.getElementById("routes").getAttribute("data-routes")),
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

					console.log(ua);
					console.log({
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
	vmProjects = Vue.component('projects', function (resolve) {
		var template = require("views-models/projects.htm!text"),
			specific = require("variations/projects.json!json");
		resolve(require('views-models/projects.js')(specific, template, mixin));
	}),
	vmContact = Vue.component('contact', function (resolve) {
		var template = require("views-models/contact.htm!text"),
			specific = require("variations/contact.json!json");
		resolve(require('views-models/contact.js')(specific, template, mixin));
	}),
	vmError = Vue.component('error', function (resolve) {
		var template = require("views-models/error.htm!text"),
			specific = require("variations/error.json!json");
		resolve(require('views-models/error.js')(specific, template, mixin));
	}),
	vm;

if (ua) {
	ga('create', ua, 'auto');
}

vm = new Vue({
	router: new VueRouter({
		mode: 'history',
		base: '/',
		routes: [{
			path: routes["home_" + lang].url, 
			component: vmHome,
			props: ['common']
		}, { 
			path: routes["projects_" + lang].url, 
			component: vmProjects,
			props: ['common']
		}, { 
			path: routes["contact_" + lang].url, 
			component: vmContact,
			props: ['common']
		}, { 
			path: '/*', 
			component: vmError,
			props: ['common']
		}]
	}),
	el: '.layout',
	data: {
		common: require("variations/common.json!json")
	}
});

NA.socket.emit("init-app");
NA.socket.on("init-app", function (me) {
	vm.me = me;
});