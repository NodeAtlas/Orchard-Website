/* jshint node: true, esversion: 6 */
/* global Vue, JSONEditor */
module.exports = function (template) {

	function createJson(self) {
		var container = self.$el.getElementsByClassName('edit--editbox')[0],
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
					console.log(self.file);
				},
				mode: 'form',
				modes: ['form', 'text', 'tree'],
				onError: function (err) {
					alert(err.toString());
				}
			});

		editor.set(self.json);
	}

	return {
		name: "edit",
		props: ['global', 'json', 'current', 'options', 'file'],
		template: template,
		data: function () {
			return {
				edit: {
					state: false,
					isInit: false
				}
			};
		},
		beforeUpdate: function () {
			if (!this.global.me.id) {
				this.edit.isInit = false;
			}
		},
		methods: {
			toggleEdit: function () {
				var jsonEditorJS,
					jsonEditorCSS,
					self = this;

				this.edit.state = !this.edit.state;

				if (!this.global.edit.isInit) {
					this.global.edit.isInit = true;
					this.edit.isInit = true;
					jsonEditorJS = document.createElement("script");
					jsonEditorCSS = document.createElement("link");
					jsonEditorJS.async = true;
					jsonEditorJS.defer = true;
					jsonEditorJS.src = 'javascripts/vendors/jsoneditor.fr-fr.js';
					jsonEditorCSS.href = 'stylesheets/vendors/jsoneditor.css';
					jsonEditorCSS.rel = 'stylesheet';
					jsonEditorJS.addEventListener('load', () => {
						createJson(self);
					});
					document.head.appendChild(jsonEditorCSS);
					document.body.appendChild(jsonEditorJS);
				}
				if (!this.edit.isInit) {
					this.edit.isInit = true;
					createJson(self);
				}
			}
		}
	};
};