define(
	[
		'src/system/fsService',
		'src/engines/angularjs/templates/templateService',
		'src/engines/angularjs/factories/services/serviceFactoryProvider'
	],
	function (fsService, templateService, serviceFactoryProvider) {
		var loggerConfigTmpl = templateService.js.getPartial('loggerConfig');
		var serviceConfig = {
			serviceName: 'logger',
			path: 'seedwork/services',
			aspects: ['aspects/loggerJsAspect'],
			angularjs: {
				config: [fsService.readFile(loggerConfigTmpl)]
			}
		};

		return serviceFactoryProvider.createFactory(serviceConfig);
	});