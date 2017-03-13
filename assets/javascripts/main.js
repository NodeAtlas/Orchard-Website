/* jshint browser: true */
/* global NA, Vue, VueRouter, require */

var lang = document.getElementsByTagName("html")[0].getAttribute("lang"),
	routes = JSON.parse(document.getElementById("routes").getAttribute("data-routes")),
	mixin = {
		beforeRouteEnter: function (to, from, next) {
			next(function (vm) {
				document.title = vm.meta.title;
			});
		}
	},
	vmHome = Vue.component('home', function (resolve) {
		var template = require("views-models/partials/home.htm!text"),
			specific = require("variations/home.json!json");
		resolve(require('views-models/partials/home.js')(specific, template, mixin));
	}),
	vmProjects = Vue.component('projects', function (resolve) {
		var template = require("views-models/partials/projects.htm!text"),
			specific = require("variations/projects.json!json");
		resolve(require('views-models/partials/projects.js')(specific, template, mixin));
	}),
	vmContact = Vue.component('contact', function (resolve) {
		var template = require("views-models/partials/contact.htm!text"),
			specific = require("variations/contact.json!json");
		resolve(require('views-models/partials/contact.js')(specific, template, mixin));
	}),
	vmError = Vue.component('error', function (resolve) {
		var template = require("views-models/partials/error.htm!text"),
			specific = require("variations/error.json!json");
		resolve(require('views-models/partials/error.js')(specific, template, mixin));
	}),
	vm = new Vue({
		router: new VueRouter({
			mode: 'history',
			base: '/',
			routes: [{ 
				path: '', 
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