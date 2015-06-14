define(['src/system/logger', 'src/system/fsService', 'src/apzContext', 'src/core/apzFileFactory', 'src/core/apzAspects'],
	function (logger, fsService, apzContext, apzFileFactory, apzAspects) {
		var dis = {};
		dis.render = render;

		function render(apz) {
			logger.log('creating apzFiles ...');
			var apzFiles = apzFileFactory.create(apz);

			logger.log('rendering apz ...');
			apzContext.isRendering = true;
			var aspects = apzAspects.getAspects();
			var renderedFiles = apzFiles.map(_renderApzFile);
			apzContext.isRendering = false;

			return renderedFiles;

			function _renderApzFile(apzFile) {
				return renderApzFile(apzFile, apz, aspects);
			}
		}

		function renderApzFile(apzFile, apz, aspects) {
			if (apzFile.feature.featureType === 'seed') {
				apzFile.content = fsService.readFile(apzContext.seedPath + '/' + apzFile.filePath);
			} else {
				apzFile.content = renderByType(apzFile, apz, aspects);
			}
			logger.debug('rendered: ' + apzFile.filePath);
			return apzFile;
		}

		function renderByType(apzFile, apz, aspects) {
			var fileExtension = fsService.getFileExtension(apzFile.filePath);
			var generator = require('src/code/' + fileExtension + 'Generator');
			var definition; // to be accesible in processAspect()
			if (generator) {
				definition = apzFile.getDefinition(apzFile.feature, apz);
				aspects.forEach(processAspect);
				return generator.generate(definition);
			}
			logger.error('apzRenderer: GENERATOR NOT FOUND FOR ' + apzFile.filePath);

			function processAspect(aspect) {
				if (aspect.applyTo(apzFile))
					definition = aspect.intercept(definition);
			}
		}

		return dis;
	});