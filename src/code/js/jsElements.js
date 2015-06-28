define(['src/code/js/elements/base', 'src/code/js/elements/functions', 'src/code/js/elements/strings'],
	function (base, functions, strings) {
		var util = require('util');
		var dis = util._extend({}, base);
		dis = util._extend(dis, functions);
		dis = util._extend(dis, strings);
		//dis = util._extend(dis, arrays);
		//dis = util._extend(dis, objects);
		//dis = util._extend(dis, variables);
		return dis;
	});