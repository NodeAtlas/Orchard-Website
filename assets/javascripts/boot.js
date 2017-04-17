/* global System, Vue */
System.config({
	defaultExtension: true,
	baseURL: document.getElementsByTagName("base")[0].getAttribute("href"),
	transpiler: 'traceur',
	map: {
		'traceur': 'javascripts/vendors/traceur.min.js',
		'text': 'javascripts/vendors/systemjs-plugin-text.min.js',
		'json': 'javascripts/vendors/systemjs-plugin-json.min.js'
	}
});
System.import(document.getElementById("systemjs").getAttribute("data-main"));