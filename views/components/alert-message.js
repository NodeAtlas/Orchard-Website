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
					this.$el.style.width = '100%';
					this.$el.style.height = '100%';
				} else {
					setTimeout(() => {
						this.$el.style['z-index'] = '';
						this.$el.style.width = '';
						this.$el.style.height = '';
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