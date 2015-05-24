define([
		'src/render/layoutRenderer', 
		'src/render/html/includeRenderer', 
		'src/render/html/libResolver'
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
			var head = layoutRenderer.renderTag('head', title + data.head);
			var body = layoutRenderer.renderBody(data.body, data.bodyAttributes);
			var html = layoutRenderer.renderTag('html', head + body);			
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