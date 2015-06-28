define(
	[
		'src/engines/angularjs/factories/helpers/controllerHelper',
		'src/engines/angularjs/factories/helpers/menuOptionHelper',
		'src/engines/angularjs/factories/helpers/routeHelper'
	],
	function (controllerHelper, menuOptionHelper, routeHelper) {
		var dis = {};
		dis.initFeature = initAngularjsFeature;

		function initAngularjsFeature(feature, components) {
			feature.angularjs = feature.angularjs || {};
			feature.angularjs.routes = feature.angularjs.routes || [];
			feature.angularjs.controllers = feature.angularjs.controllers || [];
			feature.angularjs.menuOptions = feature.angularjs.menuOptions || [];
			components.forEach(initAngularJsComponent);

			function initAngularJsComponent(component) {
				feature.angularjs.routes.push(routeHelper.getRoute(feature.featureName, component));
				feature.angularjs.controllers.push(controllerHelper.getController(feature.featureName, component));
				if (component.menuOption !== undefined)
					feature.angularjs.menuOptions.push(menuOptionHelper.getMenuOption(feature.featureName, component));
			}
		}

		return dis;
	});