define(['src/engines/angularjs/factories/services/serviceFactoryProvider'],
	function (serviceFactoryProvider) {
		var serviceConfig = {
			serviceName: 'listCtrlInitializer',
			path: 'seedwork/controllers',
			dependentFeatures: {
				dataservice: {
					featureType: 'services/baseCtrl',
					featureName: 'baseCtrlInitializer'
				}
			}
		};
		return serviceFactoryProvider.createFactory(serviceConfig);
	});