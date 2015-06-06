define(['src/system/logger', 'src/resolve/rendererResolver'],
	function (logger, rendererResolver) {
		var dis = {};
		dis.render = render;

		function render(apzFiles, apz) {
			logger.log('rendering apz ...');
			return apzFiles.map(_renderApzFile);
			
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