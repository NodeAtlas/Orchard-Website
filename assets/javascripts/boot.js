/* global System, Vue */
System.config({
	defaultExtension: true,
	baseURL: document.getElementsByTagName("base")[0].getAttribute("href"),
	transpiler: 'traceur',
	map: {
		'traceur': 'javascripts/vendor/traceur.min.js',
		'text': 'javascripts/vendor/systemjs-plugin-text.min.js',
		'json': 'javascripts/vendor/systemjs-plugin-json.min.js'
	}
});
System.import(document.getElementById("systemjs").getAttribute("data-main"));

window.scrollToBottom = function (vm) {
	var area = document.getElementsByClassName("chat--messagebox")[0];
	if (area && vm.chat.state) {
		Vue.nextTick(function () {
			area.scrollTop = area.scrollHeight;
		});
	}
};

window.sortChannels = function (a, b) {
	return (a && a.name) > (b && b.name);
};