define(['src/system/fsService', 'src/render/class/js/jsFileRenderer'],
	function (fsService, jsFileRenderer) {
		var dis = require('util')._extend({}, jsFileRenderer);
		dis.render = render;

		function render(apzFile) {
			var app = apzFile.feature;
			var body = renderBody(app);
			return jsFileRenderer.render(body);
		}

		function renderBody(app) {
			var dependencies = "'" + (app.angularjs.dependencies || []).join("','") + "'";
			var body = "angular.module('" + app.featureName + "', [" + dependencies + "])" + "\n";
			body += renderRouteConfig(app.angularjs.routes);
			body += renderElements('factory', app.angularjs.factories);
			body += renderElements('controller', app.angularjs.controllers);
			body += '\n' + "	.run(function(){ console.log('done!'); })";
			body += ";";

			return body;
		}

		function renderRouteConfig(routes) {
			var code = '';
			if (!(routes && routes.length > 0)) 
				return code;

			code +=
			"	.config(['$routeProvider'," + "\n" +
			"		function($routeProvider) {" + "\n" +
			"			$routeProvider" + "\n";

			code += routes.map(renderRoute).join('');

			code +=
			"				.otherwise({" + "\n" +
			" 					redirectTo: '" + routes[0].path + "'" + "\n" +
			"				});" + "\n" +
			"		}])";
			
			return code;
		}
		
		function renderRoute(route) {
			return "" +
				"				.when('" + route.path + "', {" + "\n" +
				"  					templateUrl: '" + route.template + ".html'," + "\n" +
				"	  				controller: '" + route.controller + "'\n" +
				"				})" + "\n";
		}

		function renderElements(elementType, elements) {
			return '\n' + (elements || []).map(renderElement).join('\n');
			
			function renderElement(element) {
				var path, elementName;
				if (typeof(element) === 'string') {
					var nameNoExtension = fsService.getNameNoExtension(element);
					path = nameNoExtension;
					elementName = nameNoExtension;
				} else {
					var elementTypeName = elementType + 'Name';
					path = element.path || element[elementTypeName];
					elementName = element[elementTypeName] || element.path;
				} 
				return "	." + elementType + "('" + path + "', " + elementName + ")";
			}
		}

		return dis;
	});