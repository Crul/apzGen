define(['src/system/fsService', 'src/core/apzContext'],
	function (fsService, apzContext) {
		var dis = {};
		dis.create = create;

		var seedPath = apzContext.seedPath;
		var allFilesWildcardPattern = /\*\.\*$/;

		function create(definition) {
			var seed = require('util')._extend({}, definition);
			seed.getApzFiles = getApzFiles;
			return seed;
		}

		function getApzFiles(definition) { // multiple returns
			var definitionPath;
			if (definition.featureName.match(allFilesWildcardPattern)) {
				definitionPath = definition.featureName.replace(allFilesWildcardPattern, '');
				var featurePath = fsService.concatPath(seedPath, definitionPath);
				return fsService.readAllFiles(featurePath).map(createApzFileFromPath);
			}
			return [createApzFile(definition.featureName)];

			function createApzFileFromPath(filePath) {
				var fullFilePath = fsService.concatPath(definitionPath, filePath);
				return createApzFile(fullFilePath);
			}
		}

		function createApzFile(filePath) {
			return {
				filePath: filePath,
				template: filePath
			};
		}

		return dis;
	});