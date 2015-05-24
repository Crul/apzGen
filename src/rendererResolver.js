define(['src/system/resolverFactory'], 
	function (resolverFactory){
		var dis = {};
		dis.resolve = resolve;
		
		var rendererResolver = resolverFactory.createResolver('render', 'Renderer.js');
		function resolve(fileDefinition){
			var feature = fileDefinition.feature;
			var renderer = fileDefinition.renderer;
			var fileType = fileDefinition.fileType;
			return rendererResolver.resolve(feature, renderer, fileType);
		}
		
		return dis;
	});