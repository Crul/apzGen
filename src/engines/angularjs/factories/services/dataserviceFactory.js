define(['src/engines/angularjs/factories/angularjsFactoryProvider'],
	function (angularjsFactoryProvider) {
		var factoryConfig = {
			factoryName: 'dataservice',
			path: 'seedwork/services',
			libs: 'lib/angular-local-storage.min.js',
			angularjs: {
				dependencies: ['LocalStorageModule']
			}
		};
		return angularjsFactoryProvider.createFactory(factoryConfig);
	});