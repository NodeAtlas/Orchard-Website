/* jshint node: true, esversion: 6 */
/* global NA, Vue */
module.exports = function (vm) {
	window.nextUpdates = {};

	NA.socket.on('edit--save', function (file, json) {
		var currentVm = (file === 'common') ? vm.common : vm.$refs.router.specific;

		if (file === 'common' || vm.$refs.router.$options.name === file) {
			for (var i in json) {
				if (json.hasOwnProperty(i)) {
					Vue.set(currentVm, i, json[i]);
				}
			}
		} else if (vm.$refs.router.$options.name !== file) {
			window.nextUpdates[file] = json;
		}
	});
};