define(['src/system/logger', 'src/system/fsService'],
	function (logger, fsService) {
		var dis = {};
		dis.write = write;

		function write(renderedFiles, outputPath) {
			logger.log('clearing "' + outputPath + '" ...');
			fsService.clearFolder(outputPath);
			logger.log('writting apzFiles to "' + outputPath + '" ...');
			fsService.writeFiles(renderedFiles, outputPath);
		}

		return dis;
	});