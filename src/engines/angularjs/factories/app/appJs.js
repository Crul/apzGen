define(['src/system/fsService'], function (fsService) {
	var dis = {};
	dis.getModel = getJsModel;

	var util = require('util');
	function getJsModel(app) {
		var jsModel = util._extend({}, app);
		jsModel.angularjs.dependencies = (jsModel.angularjs.dependencies || []).map(addQuotes);
		jsModel.angularjs.factories = (jsModel.angularjs.factories || []).map(getFileNameNoExtension);
		jsModel.angularjs.controllers = (jsModel.angularjs.controllers || []).map(getFileNameNoExtension);
		return app;
	}

	function addQuotes(str) {
		return "'" + str + "'";
	}

	function getFileNameNoExtension(angularjsElement) {
		return fsService.getNameNoExtension(angularjsElement.filePath || angularjsElement);
	}
	
	return dis;
});