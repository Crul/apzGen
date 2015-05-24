define(['src/render/js/jsFileRenderer'], 
	function (jsFileRenderer){
		var dis = {};
		dis.render = render;
		dis.getFilename = jsFileRenderer.getFilename; 
		
		function render(appConfig){
			appConfig.name = appConfig.name || 'app';			
			var body = renderBody(appConfig);
			return jsFileRenderer.render(body);
		}
		
		function renderBody(appConfig){
			var dependencies = "'" + (appConfig.angularjs.dependencies || []).join("','") + "'";			
			var body = "angular.module('" + appConfig.name + "', [" + dependencies + "])" + "\n";
			body += renderRouteConfig(appConfig.angularjs.routes);
			body += renderFactories(appConfig.angularjs.factories);
			body += renderControllers(appConfig.angularjs.controllers);
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