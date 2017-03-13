/* jshint node: true */
module.exports = function (specific, template) {
	return {
	    template: template,
		props: ['common'],
	    data: function () {
	    	return {
	    		specific: specific.contact
		    };
	  	}
	};
};