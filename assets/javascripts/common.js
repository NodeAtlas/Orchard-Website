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
	edit = require("javascripts/components/edit.js"),
	chat = require("javascripts/components/chat.js");

mixin = {
	beforeRouteEnter: function (to, from, next) {
		next(function (vmComponent) {
			global.setBeforeRouterEnter(vmComponent, to);
			edit.setBeforeRouterEnter(vmComponent);

			document.title = vmComponent.meta.title;
		});
	}
};

Vue.directive('draggable', {
	bind: function (el, binding) {
		var auth = function () { return true; },
			startX, startY, initialX, initialY;

		if (binding.value) {
			auth = function (target) {
				return [].filter.call(el.querySelectorAll(binding.value), function (element) {
					return target === element;
				}).length > 0;
			};
		}

		function move(gesture) {
			var deltaGestureX = gesture.clientX - initialX,
				deltaGestureY = gesture.clientY - initialY,
				deltaPositionX = startX + deltaGestureX,
				deltaPositionY = startY + deltaGestureY,
				limitX = parseInt(window.innerWidth - el.clientWidth, 10),
				limitY = parseInt(window.innerHeight - el.clientHeight, 10);

			if (deltaPositionY <= 0) {
				el.style.top = '0px';
			} else if (deltaPositionY >= limitY) {
				el.style.top = limitY + 'px';
			} else {
				el.style.top = startY + deltaGestureY + 'px';
			}

			if (deltaPositionX <= 0) {
				el.style.left = '0px';
			} else if (deltaPositionX >= limitX) {
				el.style.left = limitX + 'px';
			} else {
				el.style.left = startX + deltaGestureX + 'px';
			}

			return false;
		}

		function mousemove(e) {
			move(e);
		}

		function mouseup() {
			document.removeEventListener('mousemove', mousemove);
			document.removeEventListener('mouseup', mouseup);
		}

		function touchmove(e) {
			move(e.touches[0]);
		}

		function touchend() {
			document.removeEventListener('touchmove', touchmove);
			document.removeEventListener('touchend', touchend);
		}

		el.addEventListener('touchstart', function (e) {
			if (auth(e.target)) {
				startX = el.offsetLeft;
				startY = el.offsetTop;
				initialX = e.touches[0].clientX;
				initialY = e.touches[0].clientY;
				document.addEventListener('touchmove', touchmove);
				document.addEventListener('touchend', touchend);
			}
		});

		el.addEventListener('mousedown', function (e) {
			if (auth(e.target)) {
				startX = el.offsetLeft;
				startY = el.offsetTop;
				initialX = e.clientX;
				initialY = e.clientY;
				document.addEventListener('mousemove', mousemove);
				document.addEventListener('mouseup', mouseup);
				return false;
			}
		});
	}
});

Vue.directive('drag-visible', {
	bind: function (el, binding) {
		var startX, startY, initialX, initialY;

		function move() {
			var box = el.querySelector(binding.value),
				buttonLeftPosition = parseInt(el.style.left, 10),
				buttonTopPosition = parseInt(el.style.top, 10),
				boxWidth = ((box && box.clientWidth) || 0),
				boxHeight = ((box && box.clientHeight) || 0),
				leftSwitchLimit = buttonLeftPosition + el.clientWidth - boxWidth - 2 - 30,
				rightSwitchLimit = buttonLeftPosition + boxWidth + 2 + 30,
				topSwitchLimit = buttonTopPosition - boxHeight - 2 - 30,
				bottomSwitchLimit = buttonTopPosition + el.clientHeight + boxHeight + 2 + 30;

			if (leftSwitchLimit < 0) {
				el.classList.add('to-right');
			}

			if (rightSwitchLimit > window.innerWidth) {
				el.classList.remove('to-right');
			}

			if (topSwitchLimit < 0) {
				el.classList.add('to-bottom');
			}

			if (bottomSwitchLimit > window.innerHeight) {
				el.classList.remove('to-bottom');
			}

			console.log("move");

			return false;
		}

		function mousemove(e) {
			move(e);
		}

		function mouseup() {
			document.removeEventListener('mousemove', mousemove);
			document.removeEventListener('mouseup', mouseup);
		}

		function touchmove(e) {
			move(e.touches[0]);
		}

		function touchend() {
			document.removeEventListener('touchmove', touchmove);
			document.removeEventListener('touchend', touchend);
		}

		el.addEventListener('touchstart', function (e) {
			startX = el.offsetLeft;
			startY = el.offsetTop;
			initialX = e.touches[0].clientX;
			initialY = e.touches[0].clientY;
			document.addEventListener('touchmove', touchmove);
			document.addEventListener('touchend', touchend);
		});

		el.addEventListener('mousedown', function (e) {
			startX = el.offsetLeft;
			startY = el.offsetTop;
			initialX = e.clientX;
			initialY = e.clientY;
			document.addEventListener('mousemove', mousemove);
			document.addEventListener('mouseup', mouseup);
			return false;
		});
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
		template,
		options;

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
			options = {
				dirty: false
			};
			resolve(model(specific, template, mixin, options));
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

vm = new Vue(app.model(common, app.template, router, webconfig));

vm.$mount('.layout');

global.setTracking();
global.setSockets(vm);
edit.setSockets(vm);
chat.setSockets(vm);