define(['src/resolve/resolverFactory'], 
	function (resolverFactory){
		var dis = {};
		dis.resolve = resolve;
		
		var rendererResolver = resolverFactory.createResolver('factories', 'Factory.js');
		function resolve(definition){
			return rendererResolver.resolve(definition, definition.featureType);
		}
		
		return dis;
	});