define(['src/render/renderService'],
	function (renderService) {
		var js = renderService.class.renderer;
		var dis = {};
		dis.render = render;

		function render(apzFile) {
			var feature = apzFile.feature;
			var ctrlInitializer = 'listCtrlInitializer';
			return js.angularjs.ctrlInitialization(feature.featureName + 'List', ctrlInitializer);
		}

		return dis;

	});