define([], function () {
	var dis = {};
	dis.create = create;

	var baseCtrlInitializer = 'baseCtrlInitializer';
	var dependentFeatures = {
		dataservice: {
			featureType: 'dataservices/localStorage',
			featureName: 'dataservice'
		}
	};
	var apzFile = {
		fileType: 'class',
		path: 'seedwork/controllers/',
		fileName: baseCtrlInitializer,
		renderer: ''
	};
	var angularjsFactory = apzFile.path + apzFile.fileName + '.js';
	var classRendererFactory = 'src/engines/angularjs/render/factories/ctrlRendererFactory';

	function create(definition) {
		apzFile.renderer = definition.featureType;

		var initializer = { featureName: baseCtrlInitializer };
		initializer.renderPipeline = { class: [classRendererFactory] };
		initializer.dependentFeatures = dependentFeatures;
		initializer.apzFiles = [apzFile];
		initializer.angularjs = { factories: [angularjsFactory] };
		return initializer;
	}

	return dis;
});