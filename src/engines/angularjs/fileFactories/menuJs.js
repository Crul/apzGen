define(['src/code/jsElements'], function (jsElements) {
	var dis = {};
	dis.create = create;

	function create(menu) {
		return {
			filePath: menu.featureName + '/' + menu.featureName + '.js',
			getDefinition: getDefinition
		};
	}
	
	var $scope = '$scope';
	function getDefinition(menu, app) {
		var model = { areas: createAreas(menu, app) };
		var variableName = 'model';
		var object = jsElements.objectDeclaration(model);
		var $scope_model = jsElements.access($scope, variableName);
		var body = jsElements.assign($scope_model, object);
		var fn = jsElements.functionDeclaration(menu.featureName, body, $scope);
		return jsElements.program(fn);
	}

	function createAreas(menu, app) {  // multiple returns
		var definition = menu.definition;
		if (definition.areas)
			return definition.areas;

		if (definition.options)
			return [definition];

		if (Array.isArray(definition))
			return definition;

		return [{ options: createOptions(menu, app.features) }];
	}

	function createOptions(menu, features) {
		var options = [];
		var currentFeature; // accesible in exclude()
		for (var f in features) { // not [].forEach() because iterating {}
			currentFeature = features[f];
			var menuOptions = currentFeature.angularjs ? (currentFeature.angularjs.menuOptions || []) : [];
			options = options.concat(menuOptions.filter(exclude));
		}
		return options;

		function exclude(option) {
			return menu.excludeMenuOptions.indexOf(currentFeature.featureName) < 0;
		}
	}

	return dis;
});