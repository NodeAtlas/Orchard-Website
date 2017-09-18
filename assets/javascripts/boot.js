/* global System */
var websiteLanguage = document.getElementsByTagName('html')[0].getAttribute('lang').substring(0, 2);
	navigatorLanguage = window.navigator.userLanguage || window.navigator.language;

if (websiteLanguage === 'en' && navigatorLanguage.indexOf('fr') !== -1 && document.referrer.indexOf('://www.orchard-id.fr/') === -1) {
	location.href = 'https://www.orchard-id.fr/';
}

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