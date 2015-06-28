define(['src/system/fsService'], function (fsService) {
	var esprima = require('esprima');
	var dis = {};
	dis.parse = esprima.parse;
	dis.parseFile = parseFile;

	function parseFile(filePath) {
		var code = fsService.readFile(filePath);
		return esprima.parse(code);
	}

	return dis;
});