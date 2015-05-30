define(['src/engines/angularjs/render/view/htmlRenderer'],
	function (angularjsRenderer) {
		var dis = require('util')._extend({}, angularjsRenderer);

		return dis;
	});