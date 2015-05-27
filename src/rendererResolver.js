define(['src/system/resolverFactory'], 
	function (resolverFactory){
		var dis = {};
		dis.resolve = resolve;
		
		var rendererResolver = resolverFactory.createResolver('render', 'Renderer.js');
		function resolve(apzFile){
			var feature = apzFile.feature;
			var renderer = apzFile.renderer;
			var fileType = apzFile.fileType;
			return rendererResolver.resolve(feature, renderer, fileType);
		}
		
		return dis;
	});