/* jshint node: true, esversion: 6 */
/* global Vue, JSONEditor */
module.exports = function (template) {
	var editor;

	return {
		name: "edit",
		props: ['json', 'current', 'options'],
		template: template,
		data: function () {
			return {
				edit: {
					state: false,
					isInit: false
				}
			};
		},
		methods: {
			toggleEdit: function () {
				var jsonEditorJS,
					jsonEditorCSS,
					container,
					self = this;

				this.edit.state = !this.edit.state;

				if (!this.edit.isInit) {
					this.edit.isInit = true;
					jsonEditorJS = document.createElement("script");
					jsonEditorCSS = document.createElement("link");
					jsonEditorJS.async = true;
					jsonEditorJS.defer = true;
					jsonEditorJS.src = 'javascripts/vendors/jsoneditor.fr-fr.js';
					jsonEditorCSS.href = 'stylesheets/vendors/jsoneditor.css';
					jsonEditorCSS.rel = 'stylesheet';
					jsonEditorJS.addEventListener('load', () => {
						container = this.$el.getElementsByClassName('edit--editbox')[0];
		 				editor = new JSONEditor(container, {
		 					indentation: 4,
		 					sortObjectKeys: false,
		 					onChange: function () {
		 						var json;
		 						if (editor) {
									json = editor.get();
									for (var i in json) {
										if (json.hasOwnProperty(i)) {
											Vue.set(self.json, i, json[i]);
										}
									}
								}
							},
							mode: 'form',
							modes: ['form', 'text', 'tree'],
							onError: function (err) {
								alert(err.toString());
							}
						});
						editor.set(this.json);
					});

					document.head.appendChild(jsonEditorCSS);
					document.body.appendChild(jsonEditorJS);
				}
			}
		}
	};
};