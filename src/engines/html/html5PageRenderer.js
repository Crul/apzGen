define([
		'src/render/layoutRenderer', 
		'src/engines/html/util/includeRenderer', 
		'src/engines/html/util/libResolver'
	], 
	function (layoutRenderer, includeRenderer, libResolver){
		var dis = require('util')._extend({}, layoutRenderer);
		dis.render = render;
		
		var html5 = '<!DOCTYPE html>';
		
		function render(data){
			data.title = data.title || 'apzGen';
			data.head = renderHead(data);
			data.body = renderBody(data);
			var title = layoutRenderer.renderTag('title', data.title);
			var head = layoutRenderer.renderTag('head', title + data.head, data.headAttributes);
			var body = layoutRenderer.renderBody(data.body, data.bodyAttributes);
			var html = layoutRenderer.renderTag('html', head + body, data.htmlAttributes);
			return html5 + html;
		}
		
		function renderHead(data){
			var head = data.head || '';
			var cssFiles = libResolver
				.resolveCssFiles(data.libs)
				.concat(data.files);
			
			head += includeRenderer.renderCssIncludes(cssFiles);
			return head;
		}
		
		function renderBody(data){
			var body = data.body || '';
			var jsFiles = libResolver
				.resolveJsFiles(data.libs)
				.concat(data.files);
				
			body += includeRenderer.renderJsIncludes(jsFiles);
			return body;
		}
			
		return dis;
	});