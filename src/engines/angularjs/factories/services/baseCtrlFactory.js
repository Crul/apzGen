define(['src/engines/angularjs/factories/services/serviceFactoryProvider'],
	function (serviceFactoryProvider) {
		var serviceConfig = {
			serviceName: 'baseCtrlInitializer',
			path: 'seedwork/controllers',
			dependentFeatures: {
				dataservice: {
					featureType: 'services/dataservice',
					featureName: 'dataservice'
				}
			}
		};
		return serviceFactoryProvider.createFactory(serviceConfig);
	});