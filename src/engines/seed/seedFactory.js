define(['src/system/fsSvc', 'src/core/apzContext'],
	function (fsSvc, apzContext) {
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
				var featurePath = fsSvc.concatPath(seedPath, definitionPath);
				return fsSvc.readAllFiles(featurePath).map(createApzFileFromPath);
			}
			return [createApzFile(definition.featureName)];

			function createApzFileFromPath(filePath) {
				var fullFilePath = fsSvc.concatPath(definitionPath, filePath);
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