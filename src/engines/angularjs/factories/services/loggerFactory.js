define(
	[
		'src/system/fsSvc',
		'src/engines/angularjs/templates/templateService',
		'src/engines/angularjs/factories/services/serviceFactoryProvider'
	],
	function (fsSvc, templateService, serviceFactoryProvider) {
		var loggerConfigTmpl = templateService.js.getPartial('loggerConfig');
		var serviceConfig = {
			serviceName: 'logger',
			path: 'seedwork/services',
			aspects: ['aspects/loggerJsAspect'],
			angularjs: {
				config: [fsSvc.readFile(loggerConfigTmpl)]
			}
		};

		return serviceFactoryProvider.createFactory(serviceConfig);
	});