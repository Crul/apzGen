define(['src/system/logger', 'src/apzContext', 'src/resolve/rendererResolver'],
	function (logger, apzContext, rendererResolver) {
		var dis = {};
		dis.render = render;

		function render(apzFiles, apz) {
			logger.log('rendering apz ...');
			apzContext.isRendering = true;
			var renderedFiles = apzFiles.map(_renderApzFile);
			apzContext.isRendering = false;
			return renderedFiles;

			function _renderApzFile(apzFile) {
				return renderApzFile(apzFile, apz);
			}
		}

		function renderApzFile(apzFile, apz) {
			var renderer = rendererResolver.resolve(apzFile);
			apzFile.content = renderer.render(apzFile, apz);
			logger.debug('rendered: ' + apzFile.fullPath);
			return apzFile;
		}

		return dis;
	});