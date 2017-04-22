/* jshint node: true, esversion: 6 */
/* global NA, Vue, JSONEditor */
module.exports = function (template) {
	var editor;

	function createJson(self) {
		var container = self.$el.getElementsByClassName('edit--editbox')[0];

		editor = new JSONEditor(container, {
			indentation: 4,
			sortObjectKeys: false,
			onChange: function () {
				self.edit.dirty = true;
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

		editor.set(self.json);
	}

	return {
		name: "edit",
		props: ['global', 'json', 'current', 'options', 'file'],
		template: template,
		data: function () {
			return {
				edit: {
					dirty: false,
					state: false,
					isInit: false
				}
			};
		},
		beforeUpdate: function () {
			if (!this.global.me.id) {
				this.edit.dirty = false;
				this.edit.isInit = false;
			}
		},
		methods: {
			save: function () {
				NA.socket.emit('edit--save', this.file, editor.get());
				NA.socket.once('edit--save', () => {
					Vue.nextTick(() => {
						editor.destroy();
						this.edit.dirty = false;
						createJson(this);
						console.log("done");
					});
				});
			},
			toggleEdit: function () {
				var jsonEditorJS,
					jsonEditorCSS;

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
						createJson(this);
					});
					document.head.appendChild(jsonEditorCSS);
					document.body.appendChild(jsonEditorJS);
				}
				if (!this.edit.isInit) {
					this.edit.isInit = true;
					createJson(this);
				}
			}
		}
	};
};