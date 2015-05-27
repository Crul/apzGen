define(['src/system/logger', 'src/rendererResolver'],
	function (logger, rendererResolver) {
		var dis = {};
		dis.render = render;

		function render(apzFiles, app) {
			logger.log('rendering apz ...');
			return apzFiles.map(function (apzFile) {
				return renderApzFile(apzFile, app);
			});
		}

		function renderApzFile(apzFile, app) {
			var renderer = rendererResolver.resolve(apzFile);
			apzFile.content = renderer.render(apzFile.feature, app);
			logger.debug('rendered: ' + apzFile.fullPath);
			return apzFile;
		}

		return dis;
	});