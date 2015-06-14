define(['src/engines/angularjs/factories/angularjsFactoryProvider'],
	function (angularjsFactoryProvider) {
		var factoryConfig = {
			factoryName: 'iudCtrlInitializer',
			path: 'seedwork/controllers',
			dependentFeatures: {
				dataservice: {
					featureType: 'ctrlInitializers/baseCtrl',
					featureName: 'baseCtrlInitializer'
				}
			}
		};
		return angularjsFactoryProvider.createFactory(factoryConfig);
	});