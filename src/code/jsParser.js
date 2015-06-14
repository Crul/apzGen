define(['src/system/fsService'], function (fsService) {
	var esprima = require('esprima');
	var dis = {};
	dis.parse = parse;
	function parse(filePath) {
		var code = fsService.readFile(filePath);
		return esprima.parse(code);
	}

	return dis;
});