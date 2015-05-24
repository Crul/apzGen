define(['src/render/html/htmlRenderer'], 
	function (htmlRenderer){
		var dis = {};
		dis.renderCssIncludes = renderCssIncludes;
		dis.renderJsIncludes = renderJsIncludes;
	
		var cssConfig = {
			fileRegex: /\.css$/,
			includeTemplate: htmlRenderer.renderTag('link', '', 'rel="stylesheet" type="text/css" href="{filePath}"')
		};
		var jsConfig = {
			fileRegex: /\.js$/,
			includeTemplate: htmlRenderer.renderTag('script', ' ', 'src="{filePath}"')
		};
		
		function renderCssIncludes(files){
			return renderIncludes(files, cssConfig);
		}
		
		function renderJsIncludes(files){
			return renderIncludes(files, jsConfig);
		}
		
		function renderIncludes(files, config){
			var includes  = '';
			for (var f in files){
				var file = files[f];
				if (!config.fileRegex || file.name.match(config.fileRegex))
					includes += renderInclude(config.includeTemplate, file);
			}
			return includes;
		}
		
		function renderInclude(includeTemplate, file){
			var path = (file.path ? file.path + '/' : '');
			var filePath = path + file.name;
			return includeTemplate.replace(/{filePath}/, filePath);
		}
		
		return dis;
	});