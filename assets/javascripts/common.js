/* jshint browser: true, esversion: 6 */
/* global ga, Vue, VueRouter, require */
var ua = document.body.getAttribute('data-ua'),
	app = {
		template: require("views-models/app.htm!text"),
		model: require("views-models/app.js")
	},
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
	keys = Object.keys(webconfig.routes),
	routes = [],
	router,
	vm;

window.scrollToBottom = function (vm) {
	var area = document.getElementsByClassName("chat--messagebox")[0];
	if (area && vm.common.chat.state) {
		Vue.nextTick(function () {
			area.scrollTop = area.scrollHeight;
		});
	}
};

window.sortChannels = function (a, b) {
	return (a && a.name) > (b && b.name);
};

window.homeVm = Vue.component('home', function (resolve) {
	var template = require("views-models/home.htm!text"),
		specific = require("variations/home.json!json");
	resolve(require('views-models/home.js')(specific, template, mixin));
});
/* window.homeVm = Vue.component('home', function (resolve) {
	var template = `<div class="home">
			<header class="home--logo">
				<h1><img src="media/images/logo.svg" alt="Orchard ID"></h1>
			</header>
			<nav class="home--navigation">
				<ul>
					<li v-bind:class="{ 'is-selected': common.menu[0] }"><a href="https://www.orchard-id.fr" title="Site Internet de Orchard ID">Fr</a></li>
					<li v-bind:class="{ 'is-selected': common.menu[1] }"><a href="https://www.orchard-id.com" title="Website of Orchard ID">En</a></li>
				</ul>
			</nav>
			<article class="home--content">
				<h1><img src="media/images/title.svg" v-bind:alt="specific.title"></h1>
				<div v-html="specific.content"></div>
			</article>
			<footer class="home--infos">
				<div class="home--infos--identity">
					Orchard ID S.A.S.<br>
					4 rue Saint-François de Salles<br>
					74000 Annecy<br>
					France
				</div>
				<ul class="home--infos--contacts">
					<li>+33 6 66 86 92 78</li>
					<li><a href="mailto:hello@orchard-id.com" title="Contacter Orchard ID">hello@orchard-id.com</a></li>
					<li><a href="https://www.orchard-id.com" title="Site Internet de Orchard ID">www.orchard-id.com</a></li>
				</ul>
				<ul class="home--infos--networks">
					<li><a href="https://www.linkedin.com/company/orchard-id" title="Orchard ID @ LinkedIn">LinkedIn</a></li>
					<li><a href="https://plus.google.com/b/101265063888841351659/101265063888841351659" title="Orchard ID @ Google+">Google+</a></li>
					<li><a href="https://www.pinterest.com/orchardid/" title="Orchard ID @ Pinterest">Pinterest</a></li>
					<li><a href="https://www.behance.net/Orchard-ID" title="Orchard ID @ Behance">Behance</a></li>
					<li><a href="https://github.com/orchard-id" title="Orchard ID @ Github">Github</a></li>
				</ul>
			</footer>
		</div>`,
		specific = {
			"meta": {
				"title": "Bienvenue chez Orchard ID !",
				"description": "Orchard ID est une agence de communication collaborative qui vous accompagne dans votre stratégie de communication."
			},
			"body": {
				"title": "Orchard ID",
				"content": "<p>Hello.</p><p>Nous sommes une agence de communication collaborative et libérée vous accompagnant, de l'idée qui sommeille en vous à la mise en œuvre d'une stratégie de communication, sur l'ensemble des supports qui feront sens pour votre marque.</p><p><a href='https://github.com/Orchard-ID/Orchard-DocumentsPublics/raw/master/Pdf/presentation-web.pdf' target='_blank'>En savoir plus<img src='media/images/arrow.svg' alt='En savoir plus' class='arrow'></a></p>"
			}
		};
		axios.get('/views-models/home.htm').then(function (result) {
			template = result.data;
			resolve((function (specific, template, mixin) {
				return {
					name: 'home',
					template: template,
					mixins: (mixin) ? [mixin] : undefined,
					props: ['common'],
					data: function () {
						return {
							meta: specific.meta,
							specific: specific.body
						};
					}
				};
			}(specific, template, mixin)));
		});
}); */
window.loginVm = Vue.component('login', function (resolve) {
	var template = require("views-models/login.htm!text"),
		specific = require("variations/login.json!json");
	resolve(require('views-models/login.js')(specific, template, mixin));
});
window.errorVm = Vue.component('error', function (resolve) {
	var template = require("views-models/error.htm!text"),
		specific = require("variations/error.json!json");
	resolve(require('views-models/error.js')(specific, template, mixin));
});

keys.forEach(function (key) {
	var route = {},
		name = key.split('_')[0];

	route.path = webconfig.routes[key].url;
	route.component = window[name + 'Vm'];
	route.props = ['common'];

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