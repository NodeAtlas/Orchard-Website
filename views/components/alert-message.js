/* jshint node: true, esversion: 6 */
module.exports = function (template) {

	return {
		name: "alert-message",
		props: ['current', 'displayed'],
		template: template,
		watch: {
			displayed: function (value) {
				if (value) {
					this.$el.style['z-index'] = 1;
				} else {
					setTimeout(() => {
						this.$el.style['z-index'] = '';
					}, 1000);
				}
			}
		},
		methods: {
			close: function () {
				this.$emit('close');
			}
		}
	};
};