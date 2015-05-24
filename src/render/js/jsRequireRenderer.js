define(['src/render/js/jsFunctionRenderer'], 
	function (jsFunctionRenderer){
		var dis = {};
		dis.render = render;
		dis.getFilename = jsFunctionRenderer.getFilename;
		
		var dependenciesPattern = /{dependencies}/;
		var functionPattern = /{function}/;
		var template = 'define([{dependencies}], {function}); ';
		function render(functionName, body, dependencies){
			dependencies = dependencies || [];
			var stringDependencies = "'" + dependencies.join("','") + "'";
			var jsFunction = jsFunctionRenderer.render(functionName, body, dependencies);
			var requireClass = template
				.replace(dependenciesPattern, stringDependencies)
				.replace(functionPattern, jsFunction);
								
			return requireClass;
		}
				
		return dis;
	});