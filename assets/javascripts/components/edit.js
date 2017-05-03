/* jshint node: true, esversion: 6 */
/* global NA, Vue */
exports.setBeforeRouterEnter = function (vmComponent) {
	window.nextUpdates = window.nextUpdates || {};

	var json = window.nextUpdates[vmComponent.$options.name],
		i,
		j;

	if (json) {
		for (i in json.body) {
			if (json.body.hasOwnProperty(i)) {
				Vue.set(vmComponent.specific, i, json.body[i]);
			}
		}
		for (j in json.meta) {
			if (json.meta.hasOwnProperty(j)) {
				Vue.set(vmComponent.meta, j, json.meta[j]);
			}
		}
		window.nextUpdates[vmComponent.$options.name] = undefined;
	}
};

exports.setSockets = function (vm) {
	window.nextUpdates = window.nextUpdates || {};

	NA.socket.on('edit--save', function (file, body, meta) {
		var currentMeta = (file === 'common') ? vm.meta : vm.$refs.router.meta,
			currentBody = (file === 'common') ? vm.common : vm.$refs.router.specific,
			i,
			j;

		if (file === 'common' || vm.$refs.router.$options.name === file) {
			for (i in body) {
				if (body.hasOwnProperty(i)) {
					Vue.set(currentBody, i, body[i]);
				}
			}

			for (j in meta) {
				if (meta.hasOwnProperty(j)) {
					Vue.set(currentMeta, j, meta[j]);
				}
			}
			if (file !== 'common') {
				document.title = currentMeta.title;
			}
		} else if (vm.$refs.router.$options.name !== file) {
			window.nextUpdates[file] = {
				meta: meta,
				body: body
			};
		}
	});
};