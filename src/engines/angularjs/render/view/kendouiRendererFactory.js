define([], function () {

	return { create: create };

	function create(viewRenderer) {
		var util = require('util');
		var _viewRenderer = util._extend({}, viewRenderer);
		var dis = util._extend({}, viewRenderer);

		dis.renderInput = renderInput;

		function renderInput(fieldName, inputAttributes, inputConfig) {
			inputConfig = inputConfig || {};
			inputAttributes = clearBootstrapCssClass(inputConfig, inputAttributes);
			inputAttributes = dis.concat(inputAttributes, getInputControlAttrigute(inputConfig.fieldType));
			return _viewRenderer.renderInput(fieldName, inputAttributes, inputConfig);
		}

		function getInputControlAttrigute(fieldType) { // multiple returns
			switch (fieldType) {
				case 'numeric':
					return 'kendo-numeric-text-box';
			}
		}

		function clearBootstrapCssClass(inputConfig, inputAttributes) { // multiple returns
			if (inputConfig.fieldType !== 'numeric')
				return inputAttributes;

			return (inputAttributes || '').replace('class="form-control"');
		}

		return dis;
	}
});