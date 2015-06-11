// TODO split in helpers as js/helpers
define(['src/system/logger', 'src/render/renderService'],
	function (logger, renderService) {
		var base = renderService.view;

		return { create: create };

		function create(viewRenderer) {
			var util = require('util');
			var dis = util._extend({}, viewRenderer);

			dis.fileExtension = 'html';
			dis.render = render;

			dis.renderBody = renderBody;
			dis.renderTitle = renderTitle;

			dis.renderTable = renderTable;
			dis.renderTableRow = renderTableRow;
			dis.renderTableCell = renderTableCell;

			dis.renderUnorderedList = renderUnorderedList;

			dis.renderLink = renderLink;
			dis.renderButton = renderButton;
			dis.renderLinkButton = renderLink; // no special linkButton
		
			dis.renderForm = renderForm;
			dis.renderControl = renderControl;

			dis.renderLabel = renderLabel;
			dis.renderInput = renderInput;

			dis.renderTag = renderTag;
			dis.renderAttr = renderAttr;

			dis.concat = concat;

			return dis;

			function render(definition) {
				return definition.view;
			}

			function renderBody(body, bodyAttributes) {
				return renderTag('body', body, bodyAttributes);
			}

			function renderTitle(title) {
				return renderTag('h1', title);
			}

			function renderTable(config) {
				var tableAttributes = config.tableAttributes;
				var header = config.header || '';		// if undefined, config.columns will be rendered as header
				var columns = (config.columns || []);	// used to render header if it's undefined
				var body = config.body || '';

				var htmlHeader = header;
				if (!htmlHeader) {
					var headerCells = columns.map(_renderTableCell).join('');
					var headerRow = renderTableRow(headerCells);
					htmlHeader = renderTag('thead', headerRow);
				}
				var htmlBody = renderTag('tbody', body);
				var tableContent = htmlHeader + htmlBody;
				return renderTag('table', tableContent, tableAttributes);

				function _renderTableCell(c) { // wrapped to avoid re-send second param (arrayIndex because of [].map()) 
					return renderTableCell(c);
				}
			}

			function renderTableRow(cells, rowAttributes) {
				return renderTag('tr', cells, rowAttributes);
			}

			function renderTableCell(content, cellAttributes) {
				return renderTag('td', content, cellAttributes);
			}

			function renderLink(text, target, attributes) {
				attributes = concat(base.renderer.renderAttr('href', target), attributes);
				return renderTag('a', text, attributes);
			}

			function renderButton(text, action, attributes, clickAttribute) {
				attributes = concat(attributes, base.renderer.renderAttr((clickAttribute || 'click'), action));
				return renderTag('button', text, attributes);
			}

			function renderLabel(fieldName, labelAttributes) {
				labelAttributes = concat(labelAttributes, base.renderer.renderAttr('for', fieldName));
				return renderTag('label', fieldName, labelAttributes);
			}

			function renderInput(fieldName, inputAttributes) {
				inputAttributes = concat(inputAttributes, base.renderer.renderAttr('id', fieldName));
				return renderTag('input', '', inputAttributes);
			}

			function renderControl(controlConfig) {
				var fieldName = controlConfig.fieldName || controlConfig;
				var labelAttributes = controlConfig.labelAttributes;
				var inputAttributes = controlConfig.inputAttributes;
				return renderLabel(fieldName, labelAttributes) + renderInput(fieldName, inputAttributes);
			}

			function renderForm(formHtml, formAttributes) {
				return renderTag('form', formHtml, formAttributes);
			}

			function renderUnorderedList(liOptions, ulAttributes) {
				var liHtml = liOptions.map(renderUnorderedListItem).join('');
				return renderTag('ul', liHtml, ulAttributes);
			}

			function renderUnorderedListItem(option) {
				return renderTag('li', option.html, option.liAttributes);
			}

			function renderTag(tag, html, attributes) { // multiple returns
				var openTag = concat(tag, attributes);
				if (!html)
					return '\n<' + openTag + ' />';

				if (typeof (html) !== 'string')
					logger.error('htmlRenderer.renderTag: HTML IS NOT STRING: ' + JSON.stringify(html));

				var content = (html || '').trim();
				if (content)
					content = base.renderer.indent('\n' + content) + '\n';

				return '\n<' + openTag + '>' + content + '</' + tag + '>';
			}

			function renderAttr(attrName, attrValue) {
				return ' ' + attrName + '="' + attrValue + '" ';
			}

			function concat(s1, s2) {
				return (s1 || '') + (s1 && s2 ? ' ' : '') + (s2 || '');
			}
		}
	});