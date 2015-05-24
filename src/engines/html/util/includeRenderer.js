define(['src/engines/html/htmlRenderer'], 
	function (htmlRenderer){
		var dis = require('util')._extend({}, htmlRenderer);
		dis.renderCssIncludes = renderCssIncludes;
		dis.renderJsIncludes = renderJsIncludes;
	
		var cssConfig = {
			fileRegex: /\.css$/,
			includeTemplate: dis.renderTag('link', '', 'rel="stylesheet" type="text/css" href="{filePath}"')
		};
		var jsConfig = {
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
			if (config.fileRegex && !file.name.match(config.fileRegex))
				return '';
			
			var includeTemplate = config.includeTemplate;
			var path = (file.path ? file.path + '/' : '');
			var filePath = path + file.name;
			return includeTemplate.replace(/{filePath}/, filePath);
		}
		
		return dis;
	});