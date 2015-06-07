define(['src/system/utils'], function (utils) {
	var dis = {};
	var util = require('util'); 
	dis = util._extend(dis, require('src/render/codeRenderer'));
	dis = util._extend(dis, require('src/render/class/js/helpers/jsUtils'));
	dis.fileExtension = 'js';

	var includes = ['Objects', 'Strings', 'Arrays', 'Compare', 'Conditional', 'Constants', 'Functions', 'Loops', 'Notifier', 'Variables'];
	dis = utils.extendWithHelpers(dis, includes.map(includeToHelper));

	dis.return = dis.functions.return; // TODO move to functions?	
	dis.render = dis.functions.render;

	function includeToHelper(include) {
		return {
			propertyName: include.toLowerCase(),
			fileName: 'src/render/class/js/helpers/js' + include
		};
	}

	return dis;

});