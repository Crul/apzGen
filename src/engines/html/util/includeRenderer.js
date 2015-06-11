define(['src/render/renderService'],
	function (renderService) {
		var dis = require('util')._extend({}, renderService.view.renderer);
		dis.renderCssIncludes = renderCssIncludes;
		dis.renderJsIncludes = renderJsIncludes;

		var cssConfig = {
			fileExtension: 'css',
			fileRegex: /\.css$/,
			includeTemplate: dis.renderTag('link', '', 'href="{filePath}" rel="stylesheet" ')
		};
		var jsConfig = {
			fileExtension: 'js',
			fileRegex: /\.js$/,
			includeTemplate: dis.renderTag('script', ' ', 'src="{filePath}"')
		};

		function renderCssIncludes(files) {
			return renderIncludes(files, cssConfig);
		}

		function renderJsIncludes(files) {
			return renderIncludes(files, jsConfig);
		}

		function renderIncludes(files, config) {
			return (files || []).map(_renderInclude).join('');

			function _renderInclude(file) {
				return renderInclude(config, file);
			}
		}

		function renderInclude(config, file) { // multiple returns
			if (typeof (file) === 'string')
				file = { fileName: file };

			if (config.fileRegex && !file.fileName.match(config.fileRegex))
				return '';

			var filePath = file.fileName;
			if (file.fileName.indexOf('http') !== 0 && file.path)
				filePath = file.path + file.fileName;

			var includeTemplate = config.includeTemplate;
			return includeTemplate.replace(/{filePath}/, filePath);
		}

		return dis;
	});