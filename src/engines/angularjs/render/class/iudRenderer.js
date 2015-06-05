define(['src/engines/angularjs/render/class/ctrlRenderer'],
	function (ctrlRenderer) {
		var dis = {};
		dis.render = render;

		function render(apzFile) {
			var feature = apzFile.feature;
			var ctrlInitializer = 'iudCtrlInitializer';
			var dependencies = ['dataservice'];
			return ctrlRenderer.renderInitialization(
				feature.featureName,
				ctrlInitializer,
				dependencies);
		}

		return dis;

	});