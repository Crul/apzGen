define(['src/engines/angularjs/factories/services/serviceFactoryProvider'],
	function (serviceFactoryProvider) {
		var serviceConfig = {
			serviceName: 'dataservice',
			path: 'seedwork/services',
			libs: ['lib/angular-local-storage.min.js'],
			angularjs: {
				dependencies: ['LocalStorageModule']
			}
		};
		return serviceFactoryProvider.createFactory(serviceConfig);
	});