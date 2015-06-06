define(['src/render/class/js/jsFactoryRenderer'],
	function (jsFactoryRenderer) {
		var dis = {};
		dis.render = render;

		function render(apzFile) {
			var ctrlConfig = apzFile.feature.config;
			return jsFactoryRenderer.render(ctrlConfig);
		}

		return dis;
	});