define(['src/system/logger', 'src/system/fsService', 'src/apzContext'],
	function (logger, fsService, apzContext) {
		var dis = {};
		dis.create = create;

		function create(apz) {
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

		function createApzFile(definition, element) {
			definition.feature = definition.feature || element;
			definition.filePath = definition.filePath || '';
			logger.debug('created: ' + definition.filePath);
			return definition;
		}

		return dis;
	});