define(['src/render/formRenderer'], 
	function (formRenderer){
		var dis = require('util')._extend({}, formRenderer);
		
		dis.renderBody = renderBody;
		dis.renderForm = renderForm;
		dis.renderControl = renderControl;
		
		function renderBody(body, bodyAttributes){
			bodyAttributes = formRenderer.concat(bodyAttributes, 'class="container-fluid"');
			return formRenderer.renderTag('body', body, bodyAttributes);
		}
		
		function renderForm(html){
			var attributes = ' class="form-horizontal"';
			return formRenderer.renderForm(html, attributes);
		}
		
		function renderControl(field){
			var labelAttributes = 'class="col-xs-3 control-label"';
			var inputAttributes = 'class="form-control"';
			var divInputAttributes = 'class="col-xs-9"';
			var groupDivAttributes = 'class="form-group"';
			var label = formRenderer.renderLabel(field, labelAttributes);
			var input = formRenderer.renderInput(field, inputAttributes);
			var divInput = formRenderer.renderTag('div', input, divInputAttributes);
			return formRenderer.renderTag('div', label + divInput, groupDivAttributes);
		}
		
		return dis;
	});