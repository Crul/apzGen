define(
	[
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
				var logErrorMessage;
				var paths = getPaths(fileType);
				var fileNames = getFileNames(baseElement, definition, fileType);
				var resolvedInfo = resolveFile(paths, fileNames);

				if (!!resolvedInfo) {
					var filePath = resolvedInfo.filePath;
					if (filePath) {
						logger.debug('resolved: ' + filePath);
						return resolvedInfo.file;
					}
					logErrorMessage = '\n' + 'INVALID factory! resolverFactory factory: ' + '\n' + '> "' + filePath + '"' + '\n';
				} else
					logErrorMessage = '\n' + 'resolverFactory: FACTORY NOT FOUND: ' + '\n';

				logger.error(logErrorMessage + getLogInfo(paths, fileNames, baseElement, definition, fileType));
			}

			function getPaths(fileType) {
				var engines = apzContext.engines;
				var enginePaths = [''];
				engines.forEach(concatEnginePaths);
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
					definition.fileName,
					definition.definitionFeatureName,
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
					if (file) return file;
				}
			}

			function resolveFileInPath(fileNames, relativePath) {
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

			function getLogInfo(paths, fileNames, baseElement, definition, fileType) {
				var logInfo = '';
				logInfo += 'elementType = "' + elementType + '"' + '\n';
				logInfo += 'filePattern = "' + filePattern + '"' + '\n';
				logInfo += 'definition.definitionFeatureName = "' + definition.definitionFeatureName + '"' + '\n';
				logInfo += 'definition.featureName = "' + definition.featureName + '"' + '\n';
				logInfo += 'definition.fileName = "' + definition.fileName + '"' + '\n';
				logInfo += 'baseElement = "' + baseElement + '"' + '\n';
				logInfo += 'fileType = "' + fileType + '"' + '\n';
				logInfo += 'file names checked = "' + fileNames.join('", "') + '"' + '\n';
				logInfo += 'paths checked = "' + paths.join('", "') + '"' + '\n';
				return logInfo;
			}

			return { resolve: resolve };
		}

		return dis;
	});