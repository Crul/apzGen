define(['src/system/logger', 'src/system/fsService', 'src/apzContext'],
	function (logger, fsService, apzContext) {
		var dis = {};
		dis.createResolver = createResolver;

		var fs = require('fs');
		var rootPath = 'src';
		var enginesPath = 'engines';
		function createResolver(elementType, filePattern) {

			function resolve(definition, baseElement, fileType) { // multiple returns
				var paths = getPaths(fileType);
				var fileNames = getFileNames(baseElement, definition, fileType);
				var resolvedInfo = resolveFile(paths, fileNames);

				if (!resolvedInfo || !resolvedInfo.file) {
					var logErrorMessage = '\n' + 'resolverFactory: FACTORY NOT FOUND:';
					if (!!resolvedInfo) 
						logErrorMessage += '\n> filePath: ' + resolvedInfo.filePath; 
					 
					logError(logErrorMessage, paths, fileNames, baseElement, definition, fileType);
					return;
				}

				var filePath = resolvedInfo.filePath;
				logger.debug('resolved: ' + filePath);
				return resolvedInfo.file;
			}

			function getPaths(fileType) {
				var enginePaths = [''];
				apzContext.engines.forEach(concatEnginePaths);
				var fullDefaultPath = fsService.concatPath(elementType, fileType);
				enginePaths = enginePaths.concat(fsService.getAllDeeps(fullDefaultPath));
				return enginePaths;

				function concatEnginePaths(engine) {
					var fullEnginePath = fsService.concatPath(enginesPath, engine, elementType, fileType);
					enginePaths = enginePaths.concat(fsService.getAllDeeps(fullEnginePath));
				}
			}

			function getFileNames(baseElement, definition, fileType) {
				var prioritizedFilenames = [
					baseElement,
					definition,
					definition.featureName,
					definition.featureType,
					fileType
				];
				return prioritizedFilenames.filter(isValidFilename);
			}

			function isValidFilename(fileName) {
				return (typeof (fileName) === 'string');
			}

			function resolveFile(paths, fileNames) {
				for (var p in paths) { // not [].forEach() because return
					var file = resolveFileInPath(fileNames, paths[p]);
					if (file)
						return file;
				}
			}

			function resolveFileInPath(fileNames, relativePath) {
				for (var n in fileNames) { // not [].forEach() because return
					var file = requireFile(relativePath, fileNames[n]);
					if (file)
						return file;
				}
			}

			function requireFile(relativePath, fileName) {
				var fullPath = fsService.concatPath(rootPath, relativePath, fileName + filePattern);
				if (fs.existsSync(fullPath)) {
					return {
						file: require(fullPath),
						filePath: fullPath
					};
				}
			}

			function logError(errorMessage, paths, fileNames, baseElement, definition, fileType) {
				var logInfo = errorMessage + '\n';
				logInfo += 'elementType = "' + elementType + '"' + '\n';
				logInfo += 'filePattern = "' + filePattern + '"' + '\n';
				logInfo += 'definition.featureType = "' + definition.featureType + '"' + '\n';
				logInfo += 'definition.featureName = "' + definition.featureName + '"' + '\n';
				logInfo += 'definition.fileName = "' + definition.fileName + '"' + '\n';
				logInfo += 'baseElement = "' + baseElement + '"' + '\n';
				logInfo += 'fileType = "' + fileType + '"' + '\n';
				logInfo += 'file names checked = "' + fileNames.join('", "') + '"' + '\n';
				logInfo += 'paths checked = "' + paths.join('", "') + '"' + '\n';
				logger.error(logInfo);
			}

			return { resolve: resolve };
		}

		return dis;
	});