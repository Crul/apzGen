define([
	'src/system/logger',
	'src/system/fsService',
	'src/apzContext'
],
	function (logger, fsService, apzContext) {
		var dis = {};
		dis.createResolver = createResolver;

		var fs = require('fs');
		function createResolver(elementType, filePattern) {
			var rootPath = 'src';
			var enginesPath = 'engines';

			function resolve(definition, baseElement, fileType) {
				var paths = getPaths(fileType);
				var fileNames = [baseElement, definition, definition.featureName, definition.fileName, definition.definitionFeatureName, fileType]
					.filter(function (fileName) { return (typeof (fileName) === 'string'); });

				var resolvedInfo = resolveFile(paths, fileNames);
				if (!!resolvedInfo) {
					var file = resolvedInfo.file;
					var filePath = resolvedInfo.filePath;

					if (isValidType(filePath, fileType)) {
						logger.debug('resolved: ' + filePath);
						return file;
					}

					logger.error('\n'
						+ 'INVALID factory! resolverFactory factory: ' + '\n'
						+ '> "' + filePath + '"' + '\n'
						+ 'elementType = "' + elementType + '"' + '\n'
						+ 'filePattern = "' + filePattern + '"' + '\n'
						+ 'definition.definitionFeatureName = "' + definition.definitionFeatureName + '"' + '\n'
						+ 'definition.featureName = "' + definition.featureName + '"' + '\n'
						+ 'definition.fileName = "' + definition.fileName + '"' + '\n'
						+ 'baseElement = "' + baseElement + '"' + '\n'
						+ 'fileType = "' + fileType + '"' + '\n'
						+ 'file names checked = "' + fileNames.join('", "') + '"' + '\n'
						+ 'paths checked = "' + paths.join('", "') + '"' + '\n');

					return;
				}
				logger.debug('\n'
					+ 'resolverFactory: FACTORY NOT FOUND: ' + '\n'
					+ 'elementType = "' + elementType + '"' + '\n'
					+ 'filePattern = "' + filePattern + '"' + '\n'
					+ 'definition.definitionFeatureName = "' + definition.definitionFeatureName + '"' + '\n'
					+ 'definition.featureName = "' + definition.featureName + '"' + '\n'
					+ 'definition.fileName = "' + definition.fileName + '"' + '\n'
					+ 'baseElement = "' + baseElement + '"' + '\n'
					+ 'fileType = "' + fileType + '"' + '\n'
					+ 'file names checked = "' + fileNames.join('", "') + '"' + '\n'
					+ 'paths checked = "' + paths.join('", "') + '"' + '\n');
			}

			function isValidType(filePath, fileType) {
				if (!filePath) return false;
				return true;
			}

			function getPaths(fileType) {
				var engines = apzContext.engines;
				var enginePaths = [''];
				engines.forEach(function (engine) {
					var fullEnginePath = fsService.concatPath(enginesPath, engine, elementType, fileType);
					enginePaths = enginePaths.concat(fsService.getAllDeeps(fullEnginePath));
				});
				var fullDefaultPath = fsService.concatPath(elementType, fileType);
				enginePaths = enginePaths.concat(fsService.getAllDeeps(fullDefaultPath));
				return enginePaths;
			}

			function resolveFile(paths, fileNames) {
				for (var p in paths) { // not [].forEach() because return
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

			function requireFile(relativePath, fileName) {
				if (!(fileName && typeof (fileName) === 'string')) return;
				var fullPath = fsService.concatPath(rootPath, relativePath, fileName + filePattern);
				if (fs.existsSync(fullPath)) {
					return {
						file: require(fullPath),
						filePath: fullPath
					};
				}
			}

			return { resolve: resolve };
		}

		return dis;
	});