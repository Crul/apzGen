define(['src/system/fsService', 'src/apzContext'],
	function (fsService, apzContext) {
		var path = require('path');
		
		var dis = {};
		dis.create = create;

		function create(app) {
			app.apzFiles = createElementApzFiles(app);
			var apzFiles = app.apzFiles.slice(0);
			app.features.forEach(function (feature) {
				apzFiles = apzFiles.concat(createElementApzFiles(feature));
			});
			return apzFiles;
		}

		function createElementApzFiles(element) {
			return (element.apzFiles || []).map(function (apzFile) {
				return createApzFile(apzFile.feature || element,
					apzFile.path,
					apzFile.fileName,
					apzFile.fileType,
					apzFile.renderer);
			});
		}

		function createApzFile(feature, filePath, fileName, fileType, renderer) {
			fileType = fileType || getFileTypeByExtension(fileName);

			if (filePath === undefined) filePath = fileName;
			
			if (fileName.indexOf('.') < 0)
				fileName += '.' + apzContext.fileExtensions[fileType];

			var apzFile = {
				feature: feature,
				fileType: fileType,
				path: filePath,
				fileName: fileName,
				fullPath: path.join(filePath, fileName),
				renderer: renderer || feature.factory
			};

			return apzFile;
		}

		function getFileTypeByExtension(filePath) {
			var fileExtension = fsService.getExtension(filePath);
			for (var fileExtensionType in apzContext.fileExtensions) { // not [].forEach() because iterating {}
				if (fileExtension == apzContext.fileExtensions[fileExtensionType])
					return fileExtensionType;
			}
		}

		return dis;
	});