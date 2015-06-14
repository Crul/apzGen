define(['src/engines/angularjs/factories/angularjsFactoryProvider'],
	function (angularjsFactoryProvider) {
		var factoryConfig = {
			factoryName: 'listCtrlInitializer',
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