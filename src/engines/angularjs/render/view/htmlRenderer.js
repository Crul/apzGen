define(['src/render/view/html/htmlRenderer'],
	function (htmlRenderer) {
		var dis = require('util')._extend({}, htmlRenderer);
		dis.renderButton = renderButton;
		dis.renderInput = renderInput;

		function renderButton(text, action, attributes) {
			return htmlRenderer.renderButton(text, action, attributes, 'ng-click');
		}

		function renderInput(fieldName, inputAttributes, inputConfig) {
			inputAttributes = dis.concat(inputAttributes, 'ng-model="model.' + fieldName + '"');
			return htmlRenderer.renderInput(fieldName, inputAttributes, inputConfig);
		}

		return dis;
	});