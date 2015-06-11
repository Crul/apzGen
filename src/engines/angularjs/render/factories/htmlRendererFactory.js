define(['src/engines/html/htmlRendererFactory'],
	function (htmlRendererFactory) {

		return { create: create };

		function create(viewRenderer) {
			var util = require('util');			
			var htmlRenderer = htmlRendererFactory.create(viewRenderer);
			
			var renderButtonBaseFn = htmlRenderer.renderButton;
			var renderInputBaseFn = htmlRenderer.renderInput;
			 
			var dis = util._extend(htmlRenderer, viewRenderer);
			dis.renderButton = renderButton;
			dis.renderInput = renderInput;

			function renderButton(text, action, attributes) {
				return renderButtonBaseFn(text, action, attributes, 'ng-click');
			}

			function renderInput(fieldName, inputAttributes, inputConfig) {
				inputAttributes = dis.concat(inputAttributes, dis.renderAttr('ng-model', ' model.' + fieldName));
				return renderInputBaseFn(fieldName, inputAttributes, inputConfig);
			}

			return dis;
		}
	});