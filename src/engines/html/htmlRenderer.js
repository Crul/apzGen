define(['src/system/codeRenderer'], 
	function (codeRenderer){
		var dis = require('util')._extend({}, codeRenderer);
		dis.render = render;
		
		dis.renderTag = renderTag;
		dis.concat = concat;
		
		dis.renderBody = renderBody; 
		dis.renderTitle = renderTitle;
		dis.renderTable = renderTable;
		dis.renderLink = renderLink;
		dis.renderUnordererList = renderUnordererList;
		
		dis.renderButton = renderButton;
		dis.renderLabel = renderLabel;
		dis.renderInput = renderInput;
		dis.renderForm = renderForm;
		dis.renderControl = renderControl;
		
		function render(definition){
			return definition.view;
		}
			
		function renderBody(body, bodyAttributes){
			return renderTag('body', body, bodyAttributes);
		}
		
		function renderTitle(title){
			return renderTag('h1', title);
		}
		
		function renderTable(title, model){
			var headerCells = model.fields.map(function(field){ return renderTag('td', field); }).join('');
			var header = renderTag('tr', headerCells);
			var table = renderTag('table', header, 'style="width: 100%; border: solid 1px #000"');
			return table;
		}
		
		function renderLink(text, target, attributes){
			attributes = concat('href="' + target + '"', attributes); 
			return renderTag('a', text, attributes);
		}
		
		function renderButton(text, action, clickAttribute){
			var attributes = (clickAttribute || 'click') + '="' + action + '"';
			return renderTag('button', text, attributes);
		}
		
		function renderLabel(field, labelAttributes){
			labelAttributes = concat(labelAttributes, 'for="' + field + '"');
			return renderTag('label', field, labelAttributes);
		}
		
		function renderInput(field, inputAttributes){
			inputAttributes = concat(inputAttributes, 'id="' + field + '"');
			return renderTag('input', '', inputAttributes);
		}
		
		function renderControl(field, labelAttributes, inputAttributes){
			return renderLabel(field, labelAttributes) 
				 + renderInput(field, inputAttributes);
		}
		
		function renderForm(formHtml, formAttributes){
			return renderTag('form', formHtml, formAttributes);
		}
		
		function renderUnordererList(liOptions){
			var liHtml = liOptions.map(function(option){
				return renderTag('li', option.html, option.liAttributes);
			}).join('');
			return renderTag('ul', liHtml);
		}
		
		function renderTag(tag, html, attributes){
			var openTag = concat(tag, attributes);
			if (!html) return '\n<' + openTag + ' />';
			
			var content = (html || '').trim();
			if (content) content = dis.ident('\n' + content) + '\n';			
			return '\n<' + openTag + '>' + content + '</' + tag + '>';
		}
		
		function concat(s1, s2){
			return (s1 || '') + (s1 && s2 ? ' ' : '') + (s2 || '');
		}
				
		return dis;
	});