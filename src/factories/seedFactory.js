// TODO move to engines/seed ?
define(['src/system/fsService', 'src/apzContext'],
	function (fsService, apzContext) {
		var dis = {};
		dis.create = create;
		
		var seedPath = apzContext.seedPath;
		var allFilesWildcardPattern = /\*\.\*$/;

		function create(definition) {
			var seed = require('util')._extend({}, definition);
			seed.apzFiles = getApzFiles(definition);
			return seed;
		}

		function getApzFiles(definition) { // multiple returns
			var definitionPath;
			if (definition.featureName.match(allFilesWildcardPattern)) {
				definitionPath = definition.featureName.replace(allFilesWildcardPattern, '');
				var featurePath = fsService.concatPath(seedPath, definitionPath);
				return fsService.readAllFiles(featurePath).map(createApzFileFromPath);
			}
			return [createApzFile(definition)];

			function createApzFileFromPath(fileName) {
				var fullFilePath = fsService.concatPath(definitionPath, fileName);
				return createApzFile({ featureName: fullFilePath });
			}
		}

		function createApzFile(definition) {
			return {
				fileType: seedPath,
				fileName: definition.featureName,
				path: (definition.path || '')
			};
		}



		return dis;
	});