define([], function () {
	var dis = {};
	dis.create = create;

	var iudCtrlInitializer = 'iudCtrlInitializer';
	var baseCtrlInitializer = 'baseCtrlInitializer';
	var dependentFeatures = {
		baseCtrl: {
			featureType: 'ctrlInitializers/baseCtrl',
			featureName: baseCtrlInitializer
		}
	};
	var apzFile = {
		fileType: 'class',
		path: 'seedwork/controllers/',
		fileName: iudCtrlInitializer,
		renderer: ''
	};
	var angularjsFactory = apzFile.path + apzFile.fileName + '.js';

	function create(definition) {
		apzFile.renderer = definition.featureType;

		var initializer = { featureName: iudCtrlInitializer };
		initializer.dependentFeatures = dependentFeatures;
		initializer.apzFiles = [apzFile];
		initializer.angularjs = { factories: [angularjsFactory] };
		return initializer;
	}

	return dis;
});