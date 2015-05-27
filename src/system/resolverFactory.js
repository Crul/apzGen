define([
		'src/system/logger', 
		'src/system/fsService',
		'src/apzContext' 
	], 
	function (logger, fsService, apzContext){
		var dis = {};
		dis.createResolver = createResolver;
		
		var fs = require('fs');
		function createResolver(elementType, filePattern){
			var rootPath = 'src';
			var enginesPath = 'engines';
			
			function resolve(definition, baseElement, fileType) {
				var paths = getPaths(fileType);
				var fileNames = [ baseElement, definition, definition.featureName || definition.fileName, fileType ]
					.filter(function(fileName){ return (typeof(fileName) === 'string'); });
				
				var file = resolveFile(paths, fileNames);
				if (file) return file;
				
				logger.log('\n' 
					+ 'error! resolverFactory: factory not found: ' + '\n' 
					+ '\t' + 'file names checked = "' + fileNames.join('", "') + '"' + '\n' 
					+ '\t' + 'paths checked = "' + paths.join('", "') + '"' + '\n');
			}
			
			function getPaths(fileType) {
				var engines = apzContext.engines;
				var enginePaths = [];
				engines.forEach(function(engine){
					var fullEnginePath = fsService.concatPath(enginesPath, engine, elementType, fileType);
					enginePaths = enginePaths.concat(fsService.getAllDeeps(fullEnginePath));
				});
				var fullDefaultPath = fsService.concatPath(elementType, fileType);
				return enginePaths.concat(fsService.getAllDeeps(fullDefaultPath));
			}
			
			function resolveFile(paths, fileNames){
				for (var p in paths){ // not [].forEach() because return
					var file = resolveInPath(fileNames, paths[p]); 
					if (file) return file; 
				}
			}
			
			function resolveInPath(fileNames, relativePath) {
				for (var n in fileNames) { // not [].forEach() because return
					var file = requireFile(relativePath, fileNames[n]);
					if (file) return file;
				}
			}
			
			function requireFile(relativePath, fileName){
				if (!(fileName && typeof(fileName) === 'string')) return;
				var fullPath = fsService.concatPath(rootPath, relativePath) + fileName + filePattern;
				if (fs.existsSync(fullPath)) {
					logger.log('resolved: ' + fullPath);
					return require(fullPath);
				}
			}
			
			return { resolve: resolve };
		}
		
		return dis;
	});