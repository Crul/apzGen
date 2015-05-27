define(['src/system/fsService', 'src/engines/js/jsFileRenderer'],
	function (fsService, jsFileRenderer) {
		var dis = require('util')._extend({}, jsFileRenderer);
		dis.render = render;

		function render(app) {
			var body = renderBody(app);
			return jsFileRenderer.render(body);
		}

		function renderBody(app) {
			var dependencies = "'" + (app.angularjs.dependencies || []).join("','") + "'";
			var body = "angular.module('" + app.featureName + "', [" + dependencies + "])" + "\n";
			body += renderRouteConfig(app.angularjs.routes);
			body += renderElement('factory', app.angularjs.factories);
			body += renderElement('controller', app.angularjs.controllers);
			body += '\n' + "	.run(function(){ console.log('done!'); })";
			body += ";";

			return body;
		}

		function renderRouteConfig(routes) {
			var code = '';
			if (!(routes && routes.length > 0)) return code;

			code +=
			"	.config(['$routeProvider'," + "\n" +
			"		function($routeProvider) {" + "\n" +
			"			$routeProvider" + "\n";

			code += routes.map(function (route) {
				return "" +
					"				.when('" + route.path + "', {" + "\n" +
					"  					templateUrl: '" + route.template + ".html'," + "\n" +
					"	  				controller: '" + route.controller + "'\n" +
					"				})" + "\n";
			}).join('');

			code +=
			"				.otherwise({" + "\n" +
			" 					redirectTo: '" + routes[0].path + "'" + "\n" +
			"				});" + "\n" +
			"		}])";
			return code;
		}

		function renderElement(elementType, elements) {
			return '\n' + (elements || []).map(function (element) {
				var nameNoExtension = fsService.getNameNoExtension(element);
				return "	." + elementType + "('" + nameNoExtension + "', " + nameNoExtension + ")";
			}).join('\n');
		}


		return dis;
	});