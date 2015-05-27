define(['src/system/logger', 'src/rendererResolver'],
	function (logger, rendererResolver) {
		var dis = {};
		dis.render = render;

		function render(apzFiles, app) {
			return apzFiles.map(function (apzFile) {
				return renderApzFile(apzFile, app);
			});
		}

		function renderApzFile(apzFile, app) {
			var renderer = rendererResolver.resolve(apzFile);
			apzFile.content = renderer.render(apzFile.feature, app);
			logger.log('rendered: ' + apzFile.fullPath);
			return apzFile;
		}

		return dis;
	});