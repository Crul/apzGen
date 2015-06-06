define(['src/engines/angularjs/render/class/_default/ctrlRenderer'],
	function (ctrlRenderer) {
		var dis = {};
		dis.render = render;

		function render(apzFile) {
			var feature = apzFile.feature;
			var ctrlInitializer = 'listCtrlInitializer';
			return ctrlRenderer.renderInitialization(
				feature.featureName + 'List',
				ctrlInitializer);
		}

		return dis;

	});