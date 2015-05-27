define(['src/engines/html/htmlRenderer'], 
	function (htmlRenderer){
		var path = require('path');
		var dis = require('util')._extend({}, htmlRenderer);
		dis.renderCssIncludes = renderCssIncludes;
		dis.renderJsIncludes = renderJsIncludes;
	
		var cssConfig = {
			fileExtension: 'css',
			fileRegex: /\.css$/,
			includeTemplate: dis.renderTag('link', '', 'rel="stylesheet" type="text/css" href="{filePath}"')
		};
		var jsConfig = {
			fileExtension: 'js',
			fileRegex: /\.js$/,
			includeTemplate: dis.renderTag('script', ' ', 'src="{filePath}"')
		};
		
		function renderCssIncludes(files){
			return renderIncludes(files, cssConfig);
		}
		
		function renderJsIncludes(files){
			return renderIncludes(files, jsConfig);
		}
		
		function renderIncludes(files, config){
			return (files || []).map(function(file){
				return renderInclude(config, file);
			}).join('');
		}
		
		function renderInclude(config, file){
			if (typeof(file) === 'string')
				file = { fileName: file };
				
			if (config.fileRegex && !file.fileName.match(config.fileRegex))
				return '';
				
			var filePath = path.join(file.path || '', file.fileName);
			var includeTemplate = config.includeTemplate;
			return includeTemplate.replace(/{filePath}/, filePath);
		}
		
		return dis;
	});