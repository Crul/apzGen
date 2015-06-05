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
				return createApzFile(apzFile.feature || element,
					apzFile.path,
					apzFile.fileName,
					apzFile.fileType,
					apzFile.renderer);
			}
		}

		function createApzFile(feature, filePath, fileName, fileType, renderer) {
			fileType = fileType || getFileTypeByExtension(fileName);
			filePath = filePath || '';

			if (fileName.indexOf('.') < 0)
				fileName += '.' + apzContext.fileExtensions[fileType];

			var apzFile = {
				feature: feature,
				fileType: fileType,
				path: filePath,
				fileName: fileName,
				fullPath: path.join(filePath, fileName),
				renderer: renderer || feature.featureName
			};

			logger.debug('created: ' + apzFile.fullPath);
			return apzFile;
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