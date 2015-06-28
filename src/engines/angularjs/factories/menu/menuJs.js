define([], function () {
	var dis = {};
	dis.getModel = getJsModel;

	function getJsModel(menu, app) {
		var model = JSON.stringify({ areas: createAreas(menu, app) });
		return { model: model };
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