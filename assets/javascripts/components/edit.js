/* jshint node: true, esversion: 6 */
/* global NA, Vue */
module.exports = function (vm) {
	NA.socket.on('edit--save', function (file, json) {
		var currentVm = (file === 'common') ? vm.common : vm.$refs[file];

		console.log(vm.$router);
		console.log(vm.$refs.router);

		/*for (var i in json) {
			if (json.hasOwnProperty(i)) {
				Vue.set(currentVm, i, json[i]);
			}
		}*/
	});
};