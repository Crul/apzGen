define(['src/system/logger', 'src/system/fsService', 'src/apzContext'],
	function (logger, fsService, apzContext) {
		var dis = {};
		dis.resolve = resolve;

		var rootPath = 'src';
		var enginesPath = 'engines';
		var elementPath = 'factories';
		var filePattern = 'Factory.js';

		function resolve(definition) { // multiple returns
			var fileNames = getFileNames(definition);
			var paths = getPaths(fileNames);
			var resolvedInfo = resolveFile(paths, fileNames);
			if (resolvedInfo && resolvedInfo.file) {
				var filePath = resolvedInfo.filePath;
				logger.debug('resolved: ' + filePath);
				return resolvedInfo.file;
			}
			logError(resolvedInfo, paths, fileNames, definition);
		}

		function getPaths(fileNames) {
			var enginePaths = [''];
			apzContext.engines.concat(fileNames).forEach(concatEnginePaths);
			enginePaths = enginePaths.concat(elementPath);
			return enginePaths;

			function concatEnginePaths(engine) {
				var fullEnginePath = fsService.concatPath(enginesPath, engine, elementPath);
				enginePaths = enginePaths.concat(fsService.getAllDeeps(fullEnginePath));
			}
		}

		function getFileNames(definition) {
			var prioritizedFilenames = [definition, definition.featureName, definition.featureType];
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
			if (fsService.exists(fullPath)) {
				return {
					file: require(fullPath),
					filePath: fullPath
				};
			}
		}

		function logError(resolvedInfo, paths, fileNames, baseElement, definition, fileType) {
			var logErrorMessage = '\n' + 'resolverFactory: FACTORY NOT FOUND:';
			if (!!resolvedInfo)
				logErrorMessage += '\n> filePath: ' + resolvedInfo.filePath;

			var logInfo = logErrorMessage + '\n';
			logInfo += 'filePattern = "' + filePattern + '"' + '\n';
			logInfo += 'definition.featureType = "' + definition.featureType + '"' + '\n';
			logInfo += 'definition.featureName = "' + definition.featureName + '"' + '\n';
			logInfo += 'definition.filePath = "' + definition.filePath + '"' + '\n';
			logInfo += 'baseElement = "' + baseElement + '"' + '\n';
			logInfo += 'fileType = "' + fileType + '"' + '\n';
			logInfo += 'file names checked = "' + fileNames.join('", "') + '"' + '\n';
			logInfo += 'paths checked = "' + paths.join('", "') + '"' + '\n';
			logger.error(logInfo);
		}

		return dis;
	});