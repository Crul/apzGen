define(['src/default/render/classRenderer'],
	function (classRenderer) {
		var dis = {};
		dis.render = render;

		function render(apzFile, app) {
			var menu = apzFile.feature;
			var model = menu.angularjs.model || {};
			model.areas = createAreas(menu, app);
			var body = classRenderer.angularjs.modelInitializacion(model);
			return classRenderer.angularjs.renderCtrl({ 
				controllerName: menu.featureName, 
				body: body
			});
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
				options = options.concat(createFromFeature(currentFeature).filter(exclude));
			}
			return options;

			function exclude(option) {
				return menu.excludeMenuOptions.indexOf(currentFeature.featureName) < 0;
			}
		}

		function createFromFeature(feature) { // multiple returns
			if (!feature.angularjs)
				return [];

			return feature.angularjs.menuOptions || [];
		}

		return dis;

	});