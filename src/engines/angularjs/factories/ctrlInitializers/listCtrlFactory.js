define([], function () {
	var dis = {};
	dis.create = create;

	var listCtrlInitializer = 'listCtrlInitializer';
	var dependentFeatures = {
		baseCtrl: {
			featureType: 'ctrlInitializers/baseCtrl',
			featureName: 'baseCtrlInitializer'
		}
	};
	var apzFile = {
		fileType: 'class',
		path: 'seedwork/controllers/',
		fileName: listCtrlInitializer,
		renderer: ''
	};
	var angularjsFactory = apzFile.path + apzFile.fileName + '.js';

	function create(definition) {
		var initializer = { featureName: listCtrlInitializer };
		apzFile.renderer = definition.featureType;
		initializer.apzFiles = [apzFile];
		initializer.dependentFeatures = dependentFeatures;
		initializer.angularjs = { factories: [angularjsFactory] };
		return initializer;
	}

	return dis;
});