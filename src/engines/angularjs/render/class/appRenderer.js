define(['src/system/fsService', 'src/default/render/classRenderer'],
	function (fsService, classRenderer) {
		var dis = require('util')._extend({}, classRenderer);

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
			body = body.concat(renderElements('factory', app.angularjs.factories));
			body = body.concat(renderElements('controller', app.angularjs.controllers));

			var executeLogDone = dis.functions.execute('console.log', '"done!"');
			var executeLogDoneFn = dis.functions.render(executeLogDone);
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

			var otherwiseParameter = dis.objects.value({ redirectTo: routes[0].path });
			routeConfigFnBody.push(dis.functions.execute('.otherwise', otherwiseParameter));

			var routeConfigFnBodyCode = $routeProvider + '\n' + dis.indent(routeConfigFnBody.map(dis.renderJsNoEol).join('\n'));
			var routeConfigFn = dis.functions.render({ body: routeConfigFnBodyCode, parameters: $routeProvider });

			var configParam = dis.arrays.value(dis.concatJs(dis.strings.value($routeProvider), ', ', routeConfigFn));
			code.push(dis.functions.execute('.config', configParam));

			return code.map(dis.renderJsNoEol).join('\n');
		}

		function renderRoute(route) {
			var routeConfig = { templateUrl: route.template + '.html', controller: route.controller };
			var routeConfigCode = dis.objects.value(routeConfig);
			return dis.functions.execute('.when', [dis.strings.value(route.path), routeConfigCode]);
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