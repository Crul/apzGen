define(['src/engines/angularjs/render/view/htmlRenderer'],
	function (angularjsRenderer) {
		var dis = require('util')._extend({}, angularjsRenderer);

		dis.renderInput = renderInput;

		function renderInput(fieldName, inputAttributes, inputConfig) {
			inputConfig = inputConfig || {};
			inputAttributes = clearBootstrapCssClass(inputConfig, inputAttributes);
			inputAttributes = dis.concat(inputAttributes, getInputControlAttrigute(inputConfig.fieldType));
			return angularjsRenderer.renderInput(fieldName, inputAttributes, inputConfig);
		}

		function getInputControlAttrigute(fieldType) {
			switch (fieldType) {
				case 'numeric':
					return 'kendo-numeric-text-box';
			}
		}
		
		function clearBootstrapCssClass(inputConfig, inputAttributes){
			if (inputConfig.fieldType != 'numeric')
				return inputAttributes;
			// TODO how?
			return (inputAttributes || '').replace('class="form-control"');
		}

		return dis;
	});