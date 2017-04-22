/* jshint browser: true, esversion: 6 */
/* global ga, System, Vue, VueRouter, require */
var ua = document.body.getAttribute('data-ua'),
	app = {
		template: require("views-models/app.htm!text"),
		model: require("views-models/app.js")
	},
	common = require("variations/common.json!json"),
	webconfig = {
		options: require("options.json!json"),
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
	keys = Object.keys(webconfig.routes),
	routes = [],
	router,
	vm;

Vue.directive('edit', {
	bind: function (el, binding, vnode) {
		el.addEventListener('click', function () {
			console.log(el);
			console.log(binding);
			console.log(vnode);
		}, false);
	}
});

Vue.component('height-transition', function (resolve) {
	var model = require('views-models/animates/height-transition.js'),
		template = require('views-models/animates/height-transition.htm!text');

	resolve(model(template));
});

Vue.component('edit', function (resolve) {
	var model = require('views-models/components/edit.js'),
		template = require('views-models/components/edit.htm!text');

	resolve(model(template));
});

window.scrollToBottom = function (vm) {
	var area = document.getElementsByClassName("chat--messagebox")[0];
	if (area && vm.global.chat.state) {
		Vue.nextTick(function () {
			area.scrollTop = area.scrollHeight;
		});
	}
};

window.sortChannels = function (a, b) {
	return (a && a.name) > (b && b.name);
};

keys.forEach(function (key) {
	var route = {},
		name = key.split('_')[0],
		model,
		specific,
		template;

	route.path = webconfig.routes[key].url;

	route.component = Vue.component(name, function (resolve) {
		Promise.all([
			System.import('views-models/' + name + '.js'),
			System.import('variations/' + name + '.json!json'),
			System.import('views-models/' + name + '.htm!text')
		]).then(function (files) {
			model = files[0];
			specific = files[1];
			template = files[2];
			resolve(model(specific, template, mixin));
		});
	});

	route.props = ['common', 'global'];

	routes.push(route);
});

router = new VueRouter({
	mode: 'history',
	base: '/',
	routes: routes
});

if (ua) {
	ga('create', ua, 'auto');
}

vm = new Vue(app.model(common, app.template, router, webconfig));

vm.$mount('.layout');

require("javascripts/app.js")(vm);
require("javascripts/components/chat.js")(vm);
require("javascripts/components/edit.js")(vm);