define([], function () {
	var dis = {};
	dis = require('util')._extend(dis, require('src/render/codeRenderer'));
	dis = require('util')._extend(dis, require('src/render/class/js/helpers/jsUtils'));

	dis.fileExtension = 'js';

	var includeHelpers = ['Arrays', 'Compare', 'Conditional', 'Constants', 'Functions', 'Loops', 'Notifier', 'Variables'];
	
	includeHelpers.forEach(setHelper);
	function setHelper(helper) {
		dis[helper.toLowerCase()] = require('src/render/class/js/helpers/js' + helper);
	}

	dis.return = dis.functions.return; // TODO move to functions?

	return dis;
});