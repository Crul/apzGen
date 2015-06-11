define(
	[
		'src/render/renderService',
		'src/engines/html/util/includeRenderer',
		'src/engines/html/util/libResolver'
	],
	function (renderService, includeRenderer, libResolver) {
		var html = renderService.view.renderer;
		var dis = require('util')._extend({}, html);
		dis.render = render;

		var html5 = '<!DOCTYPE html>';

		function render(data) {
			data.title = data.title || 'apzGen';
			data.head = renderHead(data);
			data.body = renderBody(data);
			var title = dis.renderTag('title', data.title);
			var head = dis.renderTag('head', title + data.head, data.headAttributes);
			var body = dis.renderBody(data.body, data.bodyAttributes);
			var html = dis.renderTag('html', head + body, data.htmlAttributes);
			return html5 + html;
		}

		function renderHead(data) {
			return renderPageElement(data, 'head', libResolver.resolveCssFiles, includeRenderer.renderCssIncludes);
		}

		function renderBody(data) {
			return renderPageElement(data, 'body', libResolver.resolveJsFiles, includeRenderer.renderJsIncludes);
		}

		function renderPageElement(data, element, resolveFilesFn, renderIncludesFn) {
			var files = resolveFilesFn(data.libs).concat(data.files);
			return (data[element] || '') + renderIncludesFn(files);
		}

		return dis;
	});