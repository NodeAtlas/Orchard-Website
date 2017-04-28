/* jshint node: true */
/* global NA */
module.exports = function (common, template, router, webconfig) {
	var chat = {};

	if (NA.isClient) {
		chat.view = require("views-models/components/chat.htm!text");
		chat.model = require("views-models/components/chat.js");
	} else {
		chat.view = NA.modules.fs.readFileSync(NA.modules.path.join(NA.serverPath, NA.webconfig.viewsRelativePath, "components/chat.htm"), "utf-8");
		chat.model = require(NA.modules.path.join(NA.serverPath, NA.webconfig.viewsRelativePath, "components/chat.js"));
	}

	return {
		name: 'app',
		template: template,
		router: router,
		components: {
			'chat': chat.model(chat.view)
		},
		mounted: function () {
			setTimeout(function () {
				document.body.classList.add('as-loaded-page');
			}, 100);
		},
		data: {
			meta: common.meta,
			common: common.body,
			global: {
				isServer: common.isServer,
				webconfig: webconfig,
				me: {},
				sessionID: "",
				edit: {
					dirty: false,
					global: true,
					isLoaded: false
				},
				chat: {
					messages: [],
					channels: [],
					name: "",
					currentChannel: undefined,
					state: undefined,
					email: undefined,
					phone: undefined,
					nameExist: undefined,
					emailExist: undefined,
					phoneExist: undefined
				}
			},
		}
	};
};