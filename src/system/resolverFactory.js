define([
		'src/system/logger', 
		'src/system/appContext', 
		'src/system/path'
	], 
	function (logger, appContext, path){
		var dis = {};
		dis.createResolver = createResolver;
		
		var fs = require('fs');
		function createResolver(elementType, filePattern){
			var rootPath = 'src';
			var enginesPath = 'engines';
			
			function resolve(definition, baseElement, fileType) {
				var paths = getPaths(fileType);
				var names = [ baseElement, definition, definition.name, fileType ]
					.filter(function(name){ return (typeof(name) === 'string'); });
				
				var file = resolveFile(paths, names);
				if (file) return file;
				
				logger.log('\n' 
					+ 'error! resolverFactory: factory not found: ' + '\n' 
					+ '\t' + 'names checked = "' + names.join('", "') + '"' + '\n' 
					+ '\t' + 'paths checked = "' + paths.join('", "') + '"' + '\n');
			}
			
			function getPaths(fileType) {
				var engine = appContext.engine;
				var fullEnginePath = path.concatPath(enginesPath, engine, elementType, fileType);
				var fullDefaultPath = path.concatPath(elementType, fileType);
				return path.getAllDeeps(fullEnginePath)
					.concat(path.getAllDeeps(fullDefaultPath));
			}
			
			function resolveFile(paths, names){
				for (var p in paths){ // not [].forEach() because return
					var file = resolveInPath(names, paths[p]); 
					if (file) return file; 
				}
			}
			
			function resolveInPath(names, relativePath) {
				for (var n in names) { // not [].forEach() because return
					var file = requireFile(relativePath, names[n]);
					if (file) return file;
				}
			}
			
			function requireFile(relativePath, name){
				if (!(name && typeof(name) === 'string')) return;
				var fullPath = path.concatPath(rootPath, relativePath) + name + filePattern;
				if (fs.existsSync(fullPath)) {
					logger.log('resolved: ' + fullPath);
					return require(fullPath);
				}
			}
			
			return { resolve: resolve };
		}
		
		return dis;
	});