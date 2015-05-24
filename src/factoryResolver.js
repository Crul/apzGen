define(['src/system/resolverFactory'], 
	function (resolverFactory){
		var dis = {};
		dis.resolve = resolve;
		
		var rendererResolver = resolverFactory.createResolver('factories', 'Factory.js');
		function resolve(definition){
			return rendererResolver.resolve(definition, definition.factory);
		}
		
		return dis;
	});