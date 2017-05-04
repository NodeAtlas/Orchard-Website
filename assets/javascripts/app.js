/* jshint node: true, esversion: 6 */
/* global NA, ga */
exports.setTracking = function () {
	var ua = document.body.getAttribute('data-ua');
	if (document.body.getAttribute('data-ua')) {
		ga('create', ua, 'auto');
	}
};

exports.setBeforeRouterEnter = function (vmComponent, to) {
	if (document.body.getAttribute('data-ua')) {
		ga('send', 'pageview', to.path, {
			title: vmComponent.meta.title,
			location: location.href,
			page: to.path
		});
	}
};

exports.setSockets = function (vm) {
	NA.socket.emit('app--init');

	NA.socket.on('app--init', function (sessionID, me) {
		vm.global.loaded = true;
		vm.global.me = me;
		vm.global.sessionID = sessionID;
	});
};