define(['src/default/render/classRenderer'],
	function (classRenderer) {
		var dis = {};
		dis.render = render;

		function render(apzFile, app) {
			var menu = apzFile.feature;
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
				options = options.concat(createFromFeature(currentFeature).filter(exclude));
			}
			return options;

			function exclude(option) {
				return menu.excludeMenuOptions.indexOf(currentFeature.featureName) < 0;
			}
		}

		function createFromFeature(feature) {
			return feature.menuOptions || [];
		}

		return dis;

	});