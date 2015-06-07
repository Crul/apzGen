define(['src/default/render/classRenderer'],
	function (classRenderer) {
		var dis = {};
		dis.render = render;

		function render(apzFile) {
			var feature = apzFile.feature;
			var ctrlInitializer = 'listCtrlInitializer';
			return classRenderer.angularjs.ctrlInitialization(feature.featureName + 'List', ctrlInitializer);
		}

		return dis;

	});