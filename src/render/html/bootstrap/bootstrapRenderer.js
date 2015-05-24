define(['src/render/html/htmlRenderer'], 
	function (htmlRenderer){
		var dis = require('util')._extend({}, htmlRenderer);
		
		// layoutRenderer 
		dis.renderBody = renderBody;
		// dis.renderTitle = renderTitle;
		// dis.renderTable = renderTable;
		// dis.renderLink = renderLink;
		// dis.renderUnordererList = renderUnordererList;
		
		// TODO: ¿formRenderer?
		dis.renderForm = renderForm;
		dis.renderControl = renderControl;
		
		function renderBody(body, bodyAttributes){
			bodyAttributes = htmlRenderer.concat(bodyAttributes, 'class="container-fluid"');
			return htmlRenderer.renderTag('body', body, bodyAttributes);
		}
		
		function renderForm(html){
			var attributes = ' class="form-horizontal"';
			return htmlRenderer.renderForm(html, attributes);
		}
		
		function renderControl(field){
			var labelAttributes = 'class="col-xs-3 control-label"';
			var inputAttributes = 'class="form-control"';
			var divInputAttributes = 'class="col-xs-9"';
			var groupDivAttributes = 'class="form-group"';
			var label = htmlRenderer.renderLabel(field, labelAttributes);
			var input = htmlRenderer.renderInput(field, inputAttributes);
			var divInput = htmlRenderer.renderTag('div', input, divInputAttributes);
			return htmlRenderer.renderTag('div', label + divInput, groupDivAttributes);
		}
		
		return dis;
	});