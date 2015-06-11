define(
	[
		'src/system/fsService',
		'src/render/renderService'
	],
	function (fsService, renderService) {
		var dis = require('util')._extend({}, renderService.class.renderer);

		dis.render = render;

		function render(apzFile) {
			var app = apzFile.feature;
			return renderBody(app).render();
		}

		function renderBody(app) {
			var dependencies = dis.strings.values(app.angularjs.dependencies);
			var dependencyArray = dis.arrays.value(dependencies);
			var body = [];

			body.push(renderRouteConfig(app.angularjs.routes));
			body = body.concat(renderConfig(app.angularjs.config));

			body = body.concat(renderElements('factory', app.angularjs.factories));
			body = body.concat(renderElements('controller', app.angularjs.controllers));

			var executeLogDone = dis.functions.execute(dis.access('console', 'log'), '"done!"');
			var executeLogDoneFn = dis.functions.declare(executeLogDone);
			body.push(dis.functions.execute('.run', executeLogDoneFn));

			var executeAngularModule = dis.functions.execute('angular.module', [dis.strings.value(app.featureName), dependencyArray]);
			var executeConfigFluentApi = dis.indent(body.map(dis.renderJsNoEol).join('\n'));
			return dis.concatJs(executeAngularModule, '\n', executeConfigFluentApi);
		}

		function renderRouteConfig(routes) { // multiple returns
			var code = [];
			if (!(routes && routes.length > 0))
				return code;

			var $routeProvider = '$routeProvider';
			var routeConfigFnBody = [];
			routeConfigFnBody = routeConfigFnBody.concat(routes.map(renderRoute));

			var otherwisePath = getOtherwisePath(routes).path;
			var otherwiseParameter = dis.objects.value({ redirectTo: dis.strings.value(otherwisePath) });
			routeConfigFnBody.push(dis.functions.execute('.otherwise', otherwiseParameter));

			var routeConfigFnBodyCode = $routeProvider + '\n' + dis.indent(routeConfigFnBody.map(dis.renderJsNoEol).join('\n'));
			var routeConfigFnConfig = { body: routeConfigFnBodyCode, parameters: $routeProvider };
			var routeConfigFn = dis.functions.declare(routeConfigFnConfig);

			var configParam = dis.arrays.value(dis.concatJs(dis.strings.value($routeProvider), ', ', routeConfigFn));
			code.push(dis.functions.execute('.config', configParam));

			return code.map(dis.renderJsNoEol).join('\n');
		}

		function getOtherwisePath(routes) {
			var defaultRoute = routes.filter(isDefault);
			return defaultRoute.length > 0 ? defaultRoute[0] : routes[0];
		}
		
		function isDefault(route) {
			return route.isDefault;
		}

		function renderRoute(route) {
			var routeConfig = {
				templateUrl: dis.strings.value(route.template + '.html'),
				controller: dis.strings.value(route.controller)
			};
			var routeConfigCode = dis.objects.value(routeConfig);
			return dis.functions.execute('.when', [dis.strings.value(route.path), routeConfigCode]);
		}

		function renderConfig(config) {
			return config.map(renderConfigExecution);
		}

		function renderConfigExecution(config) {
			config = config.getConfig();
			return dis.functions.execute('.config', dis.functions.declare(config));
		}

		function renderElements(elementType, elements) {
			return (elements || []).map(renderElement);

			function renderElement(element) {
				var path, elementName;
				if (typeof (element) === 'string') {
					var nameNoExtension = fsService.getNameNoExtension(element);
					path = nameNoExtension;
					elementName = nameNoExtension;
				} else {
					var elementTypeName = elementType + 'Name';
					path = element.path || element[elementTypeName];
					elementName = element[elementTypeName] || element.path;
				}
				return dis.functions.execute('.' + elementType, [dis.strings.value(path), elementName]);
			}
		}

		return dis;
	});