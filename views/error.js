/* jshint node: true */
module.exports = function (specific, template, mixin) {
	return {
		name: 'error',
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