/* jshint node: true, esversion: 6 */
/* global NA, Vue, JSONEditor */
module.exports = function (template) {
	var editorBody,
		editorMeta;

	function createJson(self) {
		var containerBody = self.$el.getElementsByClassName('edit--editbox--body')[0],
			containerMeta = self.$el.getElementsByClassName('edit--editbox--meta')[0];

		editorMeta = new JSONEditor(containerMeta, {
			indentation: 4,
			sortObjectKeys: false,
			onChange: function () {
				self.options.dirty = true;
				var json;
				if (editorMeta) {
					json = editorMeta.get();
					for (var i in json) {
						if (json.hasOwnProperty(i)) {
							Vue.set(self.meta, i, json[i]);
						}
					}
					document.title = self.meta.title;
				}
			},
			mode: 'form',
			modes: ['form', 'text', 'tree'],
			onError: function (err) {
				alert(err.toString());
			}
		});

		editorBody = new JSONEditor(containerBody, {
			indentation: 4,
			sortObjectKeys: false,
			onChange: function () {
				self.options.dirty = true;
				var json;
				if (editorBody) {
					json = editorBody.get();
					for (var i in json) {
						if (json.hasOwnProperty(i)) {
							Vue.set(self.body, i, json[i]);
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

		editorMeta.set(self.meta);
		editorBody.set(self.body);
	}

	return {
		name: "edit",
		props: ['global', 'meta', 'body', 'current', 'options', 'file'],
		template: template,
		data: function () {
			return {
				edit: {
					tab: 'body',
					state: false,
					isInit: false,
					xPosition: 0,
					yPosition: 0
				}
			};
		},
		beforeUpdate: function () {
			if (!this.global.me.id) {
				this.edit.isInit = false;
			}
		},
		methods: {
			save: function () {
				NA.socket.emit('edit--save', this.file, this.body, this.meta);
				NA.socket.once('edit--save', () => {
					Vue.nextTick(() => {
						editorMeta.destroy();
						editorBody.destroy();
						this.options.dirty = false;
						createJson(this);
					});
				});
			},
			isMoved: function () {
				var currentStyle = getComputedStyle(this.$el);
				this.xPosition = currentStyle.left;
				this.yPosition = currentStyle.top;
			},
			toggleEdit: function () {
				var jsonEditorJS,
					jsonEditorCSS,
					min = document.getElementsByTagName('html')[0],
					currentStyle = getComputedStyle(this.$el);

				if (
					currentStyle.left === this.xPosition &&
					currentStyle.top === this.yPosition
				   ) {
					this.edit.state = !this.edit.state;

					if (!this.global.edit.isInit) {
						this.global.edit.isInit = true;
						this.edit.isInit = true;
						jsonEditorJS = document.createElement("script");
						jsonEditorCSS = document.createElement("link");
						jsonEditorJS.async = true;
						jsonEditorJS.defer = true;
						jsonEditorJS.src = 'javascripts/vendors/jsoneditor.' + min.getAttribute('lang') + min.getAttribute('data-min') + '.js';
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
		}
	};
};