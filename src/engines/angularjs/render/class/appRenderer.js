define(['src/engines/js/jsFileRenderer'], 
	function (jsFileRenderer){
		var dis = require('util')._extend({}, jsFileRenderer);
		dis.render = render;
		
		function render(app){
			var body = renderBody(app);
			return jsFileRenderer.render(body);
		}
		
		function renderBody(app){
			var dependencies = "'" + (app.angularjs.dependencies || []).join("','") + "'";			
			var body = "angular.module('" + app.name + "', [" + dependencies + "])" + "\n";
			body += renderRouteConfig(app.angularjs.routes);
			body += renderFactories(app.angularjs.factories);
			body += renderControllers(app.angularjs.controllers);
			body += '\n' + "	.run(function(){ console.log('done!'); })";
			body += ";";
			
			return body;
		}
		
		function renderRouteConfig(routes){
			var code = '';			
			if (!(routes && routes.length > 0)) return code;
				
			code +=
				"	.config(['$routeProvider'," + "\n" +
				"		function($routeProvider) {" + "\n" +
				"			$routeProvider" + "\n";
			
			code += routes.map(function(route){
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
		
		function renderFactories(factories){
			return '\n' + (factories || []).map(function(factory){
				var name = factory.nameNoExtension;
				return "	.factory('" + name + "', " + name + ")";
			}).join('\n');
		}
		
		function renderControllers(controllers){
			return '\n' + (controllers || []).map(function(controller){
				return "	.controller('" + controller + "', " + controller + ")";
			}).join('\n');
		}
		
		return dis;
	});