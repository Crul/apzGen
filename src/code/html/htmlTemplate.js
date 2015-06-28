define(['src/system/fsService'], function (fsService) {
	var hogan = require('hogan.js');
	var dis = {};
	dis.render = render;

	function render(templatePath, data, partials) {
		var template = fsService.readFile(templatePath);
		var partialsCode = loadPartials(partials);
		return hogan.compile(template).render(data, partialsCode);
	}

	function loadPartials(partials) {
		var partialsCode = {};
		for (var partialName in partials) { // not [].forEach because iterating {}
			partialsCode[partialName] = fsService.readFile(partials[partialName]);
		}
		return partialsCode;
	}

	return dis;
});