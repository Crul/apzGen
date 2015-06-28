define(['src/system/logger', 'src/system/fsSvc'],
	function (logger, fsSvc) {
		var dis = {};
		dis.write = write;

		function write(renderedFiles, outputPath) {
			logger.log('clearing "' + outputPath + '" ...');
			fsSvc.clearFolder(outputPath);
			logger.log('writting apzFiles to "' + outputPath + '" ...');
			fsSvc.writeFiles(renderedFiles, outputPath);
		}

		return dis;
	});