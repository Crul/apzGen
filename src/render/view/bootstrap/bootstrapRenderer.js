define(['src/default/render/formRenderer'],
	function (formRenderer) {
		var dis = require('util')._extend({}, formRenderer);

		dis.renderBody = renderBody;
		dis.renderTable = renderTable;
		dis.renderForm = renderForm;
		dis.renderControl = renderControl;
		dis.renderButton = renderButton;
		dis.renderLinkButton = renderLinkButton;
		dis.renderUnorderedList = renderUnorderedList;

		var bodyCssClass = 'container-fluid';
		var tableCssClass = 'table table-striped table-bordered table-hover';

		function renderBody(body, bodyAttributes) {
			bodyAttributes = dis.concat(bodyAttributes, 'class="' + bodyCssClass + '"');
			return dis.renderTag('body', body, bodyAttributes);
		}

		function renderTable(tableConfig) {
			tableConfig.tableAttributes = dis.concat(tableConfig.tableAttributes, ' class="' + tableCssClass + '"');
			return formRenderer.renderTable(tableConfig);
		}
		function renderForm(html, formAttributes, panelAttributes) {
			panelAttributes = dis.concat(panelAttributes, 'class="panel panel-default"');
			formAttributes = dis.concat(formAttributes, 'class="form-horizontal"');
			var form = formRenderer.renderForm(html, formAttributes);
			var panelBody = dis.renderTag('div', form, 'class="panel-body"');;
			var panel = dis.renderTag('div', panelBody, panelAttributes);
			return panel;
		}

		function renderControl(field) {
			var labelAttributes = 'class="col-xs-3 control-label"';
			var inputAttributes = 'class="form-control"';
			var divInputAttributes = 'class="col-xs-9"';
			var groupDivAttributes = 'class="form-group"';
			var label = dis.renderLabel(field, labelAttributes);
			var input = dis.renderInput(field, inputAttributes);
			var divInput = dis.renderTag('div', input, divInputAttributes);
			return dis.renderTag('div', label + divInput, groupDivAttributes);
		}

		function renderLinkButton(text, target, attributes) {
			attributes = dis.concat(attributes, 'class="btn btn-default"');
			return formRenderer.renderLinkButton(text, target, attributes);
		}

		function renderButton(text, action, attributes, clickAttribute) {
			attributes = dis.concat(attributes, 'class="btn btn-default"');
			return formRenderer.renderButton(text, action, attributes, clickAttribute);
		}

		function renderUnorderedList(liOptions, ulAttributes) {
			ulAttributes = dis.concat(ulAttributes, 'class="list-unstyled"');
			return formRenderer.renderUnorderedList(liOptions, ulAttributes);
		}

		return dis;
	});