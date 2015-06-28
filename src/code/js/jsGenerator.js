define([], function () {
	var escodegen = require('escodegen');
	var dis = {};
	dis.generate = generate;
	function generate(ast, options) {
		options = options || {};
		// https://github.com/estools/escodegen/wiki/API
		return escodegen.generate(ast, options);
	}
	return dis;
});