define(['src/render/view/html/htmlRenderer'], 
	function (htmlRenderer){
		var dis = require('util')._extend({}, htmlRenderer);
		dis.renderButton = renderButton;
		dis.renderInput = renderInput;
		
		function renderButton(text, action, attributes){
			return htmlRenderer.renderButton(text, action, attributes, 'ng-click');
		}
		
		function renderInput(field, inputAttributes){
			inputAttributes = dis.concat(inputAttributes, 'ng-model="model.' + field + '"');
			return htmlRenderer.renderInput(field, inputAttributes);
		}
		
		return dis;
	});