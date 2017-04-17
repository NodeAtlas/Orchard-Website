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
		name: 'App',
		template: template,
		router: router,
		components: {
			'chat': chat.model(common, chat.view)
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