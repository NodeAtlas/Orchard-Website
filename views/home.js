/* jshint node: true */
module.exports = function (specific, template, mixin) {
	return {
		name: 'home',
		template: template,
		mixins: (mixin) ? [mixin] : undefined,
		props: ['common'],
		data: function () {
			return {
				meta: specific.meta,
				specific: specific.body
			};
		}
	};
};