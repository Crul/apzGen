define([], function () {

	return { create: create };

	function create(viewRenderer) {
		var util = require('util');
		var _viewRenderer = util._extend({}, viewRenderer);
		var dis = util._extend({}, viewRenderer);
		dis.renderButton = renderButton;
		dis.renderInput = renderInput;

		function renderButton(text, action, attributes) {
			return _viewRenderer.renderButton(text, action, attributes, 'ng-click');
		}

		function renderInput(fieldName, inputAttributes, inputConfig) {
			inputAttributes = dis.concat(inputAttributes, dis.renderAttr('ng-model', ' model.' + fieldName));
			return _viewRenderer.renderInput(fieldName, inputAttributes, inputConfig);
		}

		return dis;
	}
});