define([], function () {
	var escodegen = require('escodegen');
	var dis = {};
	dis.generate = escodegen.generate;
	return dis;
});