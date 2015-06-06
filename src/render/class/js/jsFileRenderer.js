define(['src/render/codeRenderer'],
	function (codeRenderer) {
		var dis = require('util')._extend({}, codeRenderer);
		dis.fileExtension = 'js';
		dis.render = render;

		var variablePatternSeed = '\\/\\/\\{namePattern\\}|\\/\\*\\{namePattern\\}\\*\\/';
		function render(template, data) {
			return codeRenderer.render(template, data, variablePatternSeed);
		}

		return dis;
	});