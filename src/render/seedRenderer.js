define(['src/system/fsService', 'src/apzContext'],
	function (fsService, apzContext) {
		var dis = {};
		dis.render = render;

		var seedPath = apzContext.seedPath;
		function render(apzFile) {
			var _path = fsService.concatPath(seedPath, apzFile.fullPath);
			return fsService.readFile(_path);
		}

		return dis;
	});