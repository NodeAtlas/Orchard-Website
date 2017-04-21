/* jshint node: true */
module.exports = function (specific, template, mixin) {
	return {
		name: 'error',
		template: template,
		mixins: (mixin) ? [mixin] : undefined,
		props: ['common', 'global'],
		data: function () {
			return {
				meta: specific.meta,
				specific: specific.body
			};
		}
	};
};