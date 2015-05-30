define(['src/system/codeRenderer'],
	function (codeRenderer) {
		var dis = require('util')._extend({}, codeRenderer);
		dis.fileExtension = 'html';
		dis.render = render;

		dis.renderBody = renderBody;
		dis.renderTitle = renderTitle;
		dis.renderTable = renderTable;
		dis.renderTableRow = renderTableRow;
		dis.renderTableCell = renderTableCell;
		dis.renderLink = renderLink;
		dis.renderUnorderedList = renderUnorderedList;

		dis.renderButton = renderButton;
		dis.renderLinkButton = renderLink; // no special linkButton
		dis.renderLabel = renderLabel;
		dis.renderInput = renderInput;
		dis.renderForm = renderForm;
		dis.renderControl = renderControl;

		dis.renderTag = renderTag;
		dis.concat = concat;

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
			attributes = concat('href="' + target + '"', attributes);
			return renderTag('a', text, attributes);
		}

		function renderButton(text, action, attributes, clickAttribute) {
			attributes = concat(attributes,(clickAttribute || 'click') + '="' + action + '"');
			return renderTag('button', text, attributes);
		}

		function renderLabel(field, labelAttributes) {
			labelAttributes = concat(labelAttributes, 'for="' + field + '"');
			return renderTag('label', field, labelAttributes);
		}

		function renderInput(field, inputAttributes) {
			inputAttributes = concat(inputAttributes, 'id="' + field + '"');
			return renderTag('input', '', inputAttributes);
		}

		function renderControl(field, labelAttributes, inputAttributes) {
			return renderLabel(field, labelAttributes)
				+ renderInput(field, inputAttributes);
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

		function renderTag(tag, html, attributes) {
			var openTag = concat(tag, attributes);
			if (!html) return '\n<' + openTag + ' />';

			var content = (html || '').trim();
			if (content) content = dis.ident('\n' + content) + '\n';
			return '\n<' + openTag + '>' + content + '</' + tag + '>';
		}

		function concat(s1, s2) {
			return (s1 || '') + (s1 && s2 ? ' ' : '') + (s2 || '');
		}

		return dis;
	});