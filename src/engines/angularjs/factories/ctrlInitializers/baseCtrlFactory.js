define(['src/engines/angularjs/factories/angularjsFactoryProvider'],
	function (angularjsFactoryProvider) {
		var factoryConfig = {
			factoryName: 'baseCtrlInitializer',
			path: 'seedwork/controllers',
			dependentFeatures: {
				dataservice: {
					featureType: 'services/dataservice',
					featureName: 'dataservice'
				}
			}
		};
		return angularjsFactoryProvider.createFactory(factoryConfig);
	});