define(['src/system/fsSvc'], function (fsSvc) {
	var esprima = require('esprima');
	var dis = {};
	dis.parse = esprima.parse;
	dis.parseFile = parseFile;

	function parseFile(filePath) {
		var code = fsSvc.readFile(filePath);
		return esprima.parse(code);
	}

	return dis;
});