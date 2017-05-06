/* jshint browser: true, esversion: 6 */
/* global System, Vue, VueRouter, require */
var app = {
		template: require("views-models/app.htm!text"),
		model: require("views-models/app.js")
	},
	common = require("variations/common.json!json"),
	webconfig = {
		options: require("options.json!json"),
		routes: require("routes.json!json")
	},
	keys = Object.keys(webconfig.routes),
	routes = [],
	mixin,
	router,
	vm,
	global = require("javascripts/app.js"),
	edit = require("javascripts/modules/edit.js"),
	chat = require("javascripts/modules/chat.js");

mixin = {
	beforeRouteEnter: function (to, from, next) {
		next(function (vmComponent) {
			global.setBeforeRouterEnter(vmComponent, to);
			edit.setBeforeRouterEnter(vmComponent);

			document.title = vmComponent.meta.title;
		});
	}
};

Vue.directive('draggable', require('views-models/directives/draggable.js')());
Vue.directive('drag-visible', require('views-models/directives/drag-visible.js')());

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

Vue.component('alert-message', function (resolve) {
	var model = require('views-models/components/alert-message.js'),
		template = require('views-models/components/alert-message.htm!text');

	resolve(model(template));
});

window.replaceData = function (source, replacement) {
	var parsed = parseHTML(source);

	function parseHTML(htmlString) {
		var body = document.implementation.createHTMLDocument().body;
		body.innerHTML = htmlString;
		return body.childNodes;
	}

	[].forEach.call(parsed[0].querySelectorAll("[data-replace]"), function (item) {
		item.innerHTML = replacement[item.getAttribute('data-replace')];
	});

	return parsed[0].outerHTML;
};

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
		template,
		options;

	route.path = webconfig.routes[key].url;

	route.component = function (resolve) {
		Promise.all([
			System.import('views-models/' + name + '.js'),
			System.import('variations/' + name + '.json!json'),
			System.import('views-models/' + name + '.htm!text')
		]).then(function (files) {
			model = files[0];
			specific = files[1];
			template = files[2];
			options = {
				dirty: false
			};
			resolve(model(specific, template, mixin, options));
		});
	};

	route.props = ['common', 'global'];

	routes.push(route);
});

router = new VueRouter({
	mode: 'history',
	base: '/',
	routes: routes
});

vm = new Vue(app.model(common, app.template, router, webconfig));

router.onReady(function () {
	vm.$mount('.layout');
	Vue.set(vm.global, 'isClient', true);
});

global.setTracking();
global.setSockets(vm);
edit.setSockets(vm);
chat.setSockets(vm);