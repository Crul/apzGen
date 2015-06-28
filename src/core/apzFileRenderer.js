define(['src/system/logger', 'src/system/fsService', 'src/core/apzContext'],
	function (logger, fsService, apzContext) {
		var dis = {};
		dis.render = renderApzFile;

		function renderApzFile(apzFile, apz, aspects) {
			if (checkFilePath(apzFile)) {
				logger.debug('rendering: ' + apzFile.filePath);
				renderContent(apzFile, apz, aspects);
			}
			return apzFile;
		}

		function checkFilePath(apzFile) { // multiple returns
			if (apzFile.getFilePath)
				apzFile.filePath = apzFile.getFilePath(apzFile.feature);

			if (!apzFile.filePath)
				logger.error('apzRenderer UNDEFINED filePath and getFilePath()');

			return !!apzFile.filePath;
		}

		function renderContent(apzFile, apz, aspects) {
			if (apzFile.feature.featureType === 'seed') {
				apzFile.content = fsService.readFile(apzContext.seedPath + '/' + apzFile.filePath);
			} else {
				apzFile.content = renderByType(apzFile, apz, aspects);
			}
		}

		function renderByType(apzFile, apz, aspects) { // multiple returns
			var fileExtension = fsService.getFileExtension(apzFile.filePath);
			var fileContent = getFileContent(apzFile, fileExtension);

			var codeParser = getCodeElement('Parser', apzFile, fileExtension);
			if (!codeParser)
				return;

			var codeGenerator = getCodeElement('Generator', apzFile, fileExtension);
			if (!codeGenerator)
				return;

			var code; // to be accesible in processAspect()
			code = codeParser.parse(fileContent);
			aspects.forEach(processAspect);
			return codeGenerator.generate(code);

			function processAspect(aspect) {
				// TODO move .nodeVisitor() to apzRenderer 
				if (aspect.applyTo(apzFile))
					code = aspect.intercept(code);
			}
		}

		function getFileContent(apzFile, fileExtension) { // multiple returns
			var template = apzFile.template;
			if (!template) {
				logger.error('apzRenderer: UNDEFINED TEMPLATE, apzFile: ' + apzFile.filePath);
				return;
			}

			var fileContent = '';
			if (apzFile.model) {
				var codeTemplate = getCodeElement('Template', apzFile, fileExtension);
				if (codeTemplate)
					fileContent = codeTemplate.render(template, apzFile.model, apzFile.partials);
			} else {
				fileContent = fsService.readFile(template);
			}
			return fileContent;
		}

		function getCodeElement(element, apzFile, fileExtension) {
			var codeElement = require('src/code/' + fileExtension + '/' + fileExtension + element);
			if (!codeElement)
				logger.error('apzRenderer: ' + element + ' NOT FOUND FOR ' + apzFile.filePath);
			return codeElement;
		}

		return dis;
	});