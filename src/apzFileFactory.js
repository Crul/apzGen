define(
	[
		'src/system/logger',
		'src/system/fsService',
		'src/apzContext'
	],
	function (logger, fsService, apzContext) {
		var path = require('path');

		var dis = {};
		dis.create = create;

		function create(apz) {
			logger.log('creating apzFiles ...');
			apz.apzFiles = createElementApzFiles(apz);
			var apzFiles = apz.apzFiles.slice(0);
			apz.features.forEach(concatFeatureApzFiles);
			return apzFiles;

			function concatFeatureApzFiles(feature) {
				apzFiles = apzFiles.concat(createElementApzFiles(feature));
			}
		}

		function createElementApzFiles(element) {
			return (element.apzFiles || []).map(createElementApzFile);
			
			function createElementApzFile(apzFile) {
				return createApzFile(apzFile, element);
			}
		}

		function createApzFile(apzFileDefinition, element) {
			var feature = apzFileDefinition.feature || element;
			var filePath = apzFileDefinition.path || '';
			var fileName = apzFileDefinition.fileName;
			var fileType = apzFileDefinition.fileType || getFileTypeByExtension(fileName);
			var renderer = apzFileDefinition.renderer || feature.featureName;

			if (fileName.indexOf('.') < 0)
				fileName += '.' + apzContext.fileExtensions[fileType];

			var fullPath = path.join(filePath, fileName);
			logger.debug('created: ' + fullPath);			
			return {
				feature: feature,
				fileType: fileType,
				path: filePath,
				fileName: fileName,
				fullPath: fullPath,
				renderer: renderer
			};
		}

		function getFileTypeByExtension(filePath) {
			var fileExtension = fsService.getFileExtension(filePath);
			for (var fileExtensionType in apzContext.fileExtensions) { // not [].forEach() because iterating {}
				if (fileExtension == apzContext.fileExtensions[fileExtensionType])
					return fileExtensionType;
			}
		}

		return dis;
	});