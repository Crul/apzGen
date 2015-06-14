define(['src/system/fsService', 'src/code/jsElements'],
	function (fsService, jsElements) {
		var dis = {};
		dis.create = create;

		function create() {
			return { filePath: 'app.js', getDefinition: getDefinition };
		}

		function getDefinition(app) {
			var angularjsModule = getAngularjsModule(app);

			app.angularjs.config.forEach(function (configFunction) {
				angularjsModule = executeAngularjsConfig(angularjsModule, configFunction);
			});

			angularjsModule = executeRouteConfig(app.angularjs.routes, angularjsModule);
			angularjsModule = executeElements('factory', app.angularjs.factories, angularjsModule);
			angularjsModule = executeElements('controller', app.angularjs.controllers, angularjsModule);
			angularjsModule = jsElements.expressionStatement(angularjsModule);
			return jsElements.program(angularjsModule);
		}

		function getAngularjsModule(app) {
			var appLiteral = jsElements.literal('app');
			var dependencyLiterals = (app.angularjs.dependencies || []).map(jsElements.literal);
			var dependencies = jsElements.array(dependencyLiterals);
			return jsElements.callFunction('angular', 'module', [appLiteral, dependencies]);
		}

		function executeElements(elementType, elements, angularjsModule) {
			(elements || []).forEach(executeElement);
			return angularjsModule;

			function executeElement(element) {
				var elementName = fsService.getNameNoExtension(element);
				var elementLiteral = jsElements.literal(elementName);
				var elementIdentifier = jsElements.identifier(elementName);
				angularjsModule = jsElements.callFunction(angularjsModule, elementType, [elementLiteral, elementIdentifier]);
			}
		}

		function executeAngularjsConfig(angularjsModule, configFunction) {
			return jsElements.callFunction(angularjsModule, 'config', configFunction);
		}

		function executeRouteConfig(routes, angularjsModule) { // multiple returns
			if (!routes || routes.length === 0)
				return angularjsModule;

			var configExecution = '$routeProvider';
			routes.forEach(configureRoute);
			configExecution = executeOtherwise(configExecution, routes);

			var routeProviderFn = jsElements.functionDeclaration('', configExecution, '$routeProvider');
			return executeAngularjsConfig(angularjsModule, routeProviderFn);

			function configureRoute(route) {
				var routeLiteral = jsElements.literal(route.path);
				var routeConfig = {
					templateUrl: route.template + '.html',
					controller: route.controller
				};
				var routeArguments = [routeLiteral, jsElements.objectDeclaration(routeConfig)];
				configExecution = jsElements.callFunction(configExecution, 'when', routeArguments);
			}
		}

		function executeOtherwise(configExecution, routes) {
			var defaultRoute = routes.filter(isDefault);
			var otherwiseRoute = defaultRoute.length > 0 ? defaultRoute[0] : routes[0];
			var otherwisePath = jsElements.literal(otherwiseRoute.path);
			return jsElements.callFunction(configExecution, 'otherwise', otherwisePath);
		}

		function isDefault(route) {
			return route.isDefault;
		}

		return dis;
	});