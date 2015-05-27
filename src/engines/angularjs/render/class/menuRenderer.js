define(['src/render/classRenderer'],
	function (classRenderer) {
		var dis = {};
		dis.render = render;

		function render(menu, app) {
			menu.model = menu.model || {};
			menu.model.areas = createAreas(menu, app);
			var body = classRenderer.renderModelInitializacion(menu.model);
			return classRenderer.render(menu.featureName, body);
		}

		function createAreas(menu, app) {
			var definition = menu.definition;
			if (definition.areas) return definition.areas;
			if (definition.options) return [definition];
			if (Array.isArray(definition)) return definition;
			return [{ options: createOptions(menu, app.features) }];
		}

		function createOptions(menu, features) {
			var options = [];
			var currentFeature; // accesible in exclude()
			for (var f in features) { // not [].map() because iterating {}
				currentFeature = features[f];
				options = options.filter(exclude).concat(createFromFeature(currentFeature));
			}
			return options;

			function exclude(option) { // inside createOptions to get currentFeatrue accesible
				return menu.excludeMenuOptions.indexOf(currentFeature.featureName) >= 0;
			}
		}

		function createFromFeature(feature) {
			if (feature.menuOptions) return feature.menuOptions;
			return [{ path: feature.featureName, optionName: feature.featureName }];
		}

		return dis;

	});