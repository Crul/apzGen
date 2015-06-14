define(['src/engines/angularjs/factories/angularjsFactoryProvider', 'src/engines/angularjs/aspects/loggerJsAspect', 'src/code/jsElements'],
	function (angularjsFactoryProvider, loggerJsAspect, jsElements) {
		var logger = 'logger';
		var factoryConfig = {
			factoryName: logger,
			path: 'seedwork/services',
			aspects: [loggerJsAspect],
			angularjs: { notFactory: true, config: [getAngularjsConfig()] }
		};

		return angularjsFactoryProvider.createFactory(factoryConfig);

		function getAngularjsConfig() {
			// TODO try to move to seed code file, if success then move angularjs seed files (seed/seedwork) to .json
			var $provide = '$provide';
			var $log = '$log';
			var decoratorParams = [jsElements.literal($log), jsElements.identifier(logger)];
			var decoratorExecution = jsElements.callFunction($provide, 'decorator', decoratorParams);
			var returnExecution = jsElements.return(decoratorExecution);
			var configFn = jsElements.functionDeclaration('', [returnExecution], $provide);
			return configFn;
		}
	});