/* jshint node: true */
module.exports = function (specific, template, mixin) {
	return {
	    template: template,
	    mixins: (mixin) ? [mixin] : undefined,
		props: ['common'],
	    data: function () {
	    	return {
	    		meta: specific.meta,
	    		specific: specific.body,
	    		email: undefined,
				password: undefined
		    };
	  	},
		methods: {
			checkEmail: function (email) {
				var regex = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;
				return regex.test(email);
			},
			check: function () {
				return this.checkEmail && this.checkEmail(this.email) && this.password;
			},
			sendLogin: function () {
				if (this.check()) {
					console.log("Done");
					/*NA.socket.emit("email", { 
						email: this.email, 
						password: new Hashes.SHA1().hex(this.password)
					});*/
				}
			},
		}
	};
};