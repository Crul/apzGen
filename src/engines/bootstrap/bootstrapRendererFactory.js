define(['src/render/renderService'],
	function (renderService) {
		var base = renderService.view;
		
		return { create: create };

		function create(viewRenderer) {
			var util = require('util');

			var renderTableBaseFn = viewRenderer.renderTable;
			var renderFormBaseFn = viewRenderer.renderForm;
			var renderLinkButtonBaseFn = viewRenderer.renderLinkButton;
			var renderkButtonBaseFn = viewRenderer.renderButton;
			var renderUnorderedListBaseFn = viewRenderer.renderUnorderedList;

			var dis = util._extend({}, viewRenderer);

			dis.renderBody = renderBody;
			dis.renderTable = renderTable;
			dis.renderForm = renderForm;
			dis.renderControl = renderControl;
			dis.renderButton = renderButton;
			dis.renderLinkButton = renderLinkButton;
			dis.renderUnorderedList = renderUnorderedList;

			var bodyCssClass = 'container';
			var tableCssClass = 'table table-striped table-bordered table-hover';

			function renderBody(body, bodyAttributes) {
				bodyAttributes = base.renderer.concat(bodyAttributes, base.renderer.renderAttr('class', bodyCssClass));
				return base.renderer.renderTag('body', body, bodyAttributes);
			}

			function renderTable(tableConfig) {
				tableConfig.tableAttributes = base.renderer.concat(tableConfig.tableAttributes, base.renderer.renderAttr('class', tableCssClass));
				return renderTableBaseFn(tableConfig);
			}

			function renderForm(html, formAttributes, panelAttributes) {
				panelAttributes = base.renderer.concat(panelAttributes, 'class="panel panel-default"');
				formAttributes = base.renderer.concat(formAttributes, 'class="form-horizontal"');
				var form = renderFormBaseFn(html, formAttributes);
				var panelBody = base.renderer.renderTag('div', form, 'class="panel-body"');
				var panel = base.renderer.renderTag('div', panelBody, panelAttributes);
				return panel;
			}

			function renderControl(controlConfig) {
				var fieldName = controlConfig.fieldName;
				var fieldLabel = controlConfig.label || fieldName;
				var labelAttributes = 'class="col-xs-3 control-label"';
				var inputAttributes = 'class="form-control"';
				var divInputAttributes = 'class="col-xs-9"';
				var groupDivAttributes = 'class="form-group"';
				var label = base.renderer.renderLabel(fieldLabel, labelAttributes);
				var input = base.renderer.renderInput(fieldName, inputAttributes, controlConfig);
				var divInput = base.renderer.renderTag('div', input, divInputAttributes);
				return base.renderer.renderTag('div', label + divInput, groupDivAttributes);
			}

			function renderLinkButton(text, target, attributes) {
				attributes = base.renderer.concat(attributes, 'class="btn btn-default"');
				return renderLinkButtonBaseFn(text, target, attributes);
			}

			function renderButton(text, action, attributes, clickAttribute) {
				attributes = base.renderer.concat(attributes, 'class="btn btn-default"');
				return renderkButtonBaseFn(text, action, attributes, clickAttribute);
			}

			function renderUnorderedList(liOptions, ulAttributes) {
				ulAttributes = base.renderer.concat(ulAttributes, 'class="list-unstyled"');
				return renderUnorderedListBaseFn(liOptions, ulAttributes);
			}

			return dis;
		}
	});