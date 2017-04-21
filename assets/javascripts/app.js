/* jshint node: true, esversion: 6 */
/* global NA */
module.exports = function (vm) {
	NA.socket.emit('app--init');

	NA.socket.on('app--init', function (sessionID, me) {
		vm.global.me = me;
		vm.global.sessionID = sessionID;
	});
};