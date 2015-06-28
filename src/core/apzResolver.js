define(['src/system/logger', 'src/system/fsService', 'src/core/apzContext'],
	function (logger, fsService, apzContext) {
		var util = require('util');
		var dis = {};
		dis.resolveFactory = resolveFactory;
		dis.resolveAspect = resolveAspect;
		dis.resolveJson = resolveJson;

		var rootPath = 'src';
		var enginesPath = 'engines';
		var factoriesPath = 'factories';
		var jsPattern = '.js';
		var factoryPattern = 'Factory' + jsPattern;
		var jsonPattern = '.json';

		function resolveFactory(definition) {
			var avoidLog = true;
			return resolveElement(definition, factoryPattern, avoidLog);
		}

		function resolveAspect(aspect) {
			return resolveElement(aspect, jsPattern);
		}

		function resolveJson(definition) {
			var json = resolveElement(definition, jsonPattern);
			return util._extend(json, definition);
		}

		function resolveElement(definition, filePattern, avoidLog) { // multiple returns
			var fileNames = getFileNames(definition);
			var paths = getPaths(fileNames);
			var resolvedInfo = resolveFile(paths, fileNames, filePattern);

			if (resolvedInfo && resolvedInfo.file) {
				logger.trace('resolved: ' + resolvedInfo.filePath.replace(/^src\//, ''));
				return resolvedInfo.file;
			}
			if (!avoidLog)
				log(resolvedInfo, paths, fileNames, definition, filePattern);
		}

		function getPaths(fileNames) {
			var enginePaths = [''];
			apzContext.engines.concat(fileNames).forEach(concatEnginePaths);
			enginePaths = enginePaths.concat(factoriesPath);
			return enginePaths;

			function concatEnginePaths(engine) {
				var fullEnginePath = fsService.concatPath(enginesPath, engine, factoriesPath);
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

		function resolveFile(paths, fileNames, filePattern) {
			for (var p in paths) { // not [].forEach() because return
				var file = resolveFileInPath(fileNames, paths[p], filePattern);
				if (file)
					return file;
			}
		}

		function resolveFileInPath(fileNames, relativePath, filePattern) {
			for (var n in fileNames) { // not [].forEach() because return
				var file = requireFile(relativePath, fileNames[n], filePattern);
				if (file)
					return file;
			}
		}

		function requireFile(relativePath, fileName, filePattern) {
			var fullPath = fsService.concatPath(rootPath, relativePath, fileName + filePattern);
			if (fsService.exists(fullPath)) {
				return {
					file: requireFileByType(fullPath, filePattern),
					filePath: fullPath
				};
			}
		}

		function requireFileByType(fullPath, filePattern) {
			return (filePattern == jsonPattern) ? JSON.parse(fsService.readFile(fullPath)) : require(fullPath);
		}

		function log(resolvedInfo, paths, fileNames, definition, filePattern) {
			var logWarningMessage = '\n' + 'apzResolver: FILE NOT FOUND:';
			if (!!resolvedInfo)
				logWarningMessage += '\n\t> filePath: ' + resolvedInfo.filePath;

			var logInfo = logWarningMessage + '\n';
			if (definition)
				logInfo += '\tdefinition.featureName = ' + definition.featureName + '\n';
			else
				logInfo += '\tdefinition = UNDEFINED\n';
			logInfo += '\tfilePattern = "' + filePattern + '"' + '\n';
			logInfo += '\tfile names checked = "' + fileNames.join('", "') + '"' + '\n';
			logInfo += '\tpaths checked = "' + paths.join('", "') + '"' + '\n';
			logger.debug(logInfo);
		}

		return dis;
	});