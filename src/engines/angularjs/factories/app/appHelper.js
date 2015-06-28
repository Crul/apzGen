define(['src/system/utils', 'src/system/fsService', 'src/engines/angularjs/factories/app/appApzFilesFactory'],
	function (utils, fsService, appApzFilesFactory) {
		var dis = {};
		dis.initFeature = initFeature;
		dis.getAngularjs = getAngularjs;

		function initFeature(app, requiredLibs) {
			var libs = (app.libs || [])
				.concat(requiredLibs)
				.concat(initElements('libs', app));

			app.libs = utils.arrays.distinct(libs);
			app.featureName = app.appName || app.featureName || 'apzApp';
			app.getApzFiles = appApzFilesFactory.createApzFiles;
		}

		var angularjsElements = ['routes', 'config', 'factories', 'controllers', 'dependencies'];
		function getAngularjs(app, angularjsDependencies) {
			var angularjs = app.angularjs || {};
			angularjs.dependencies = angularjsDependencies;
			angularjsElements.forEach(initAngularjsElement);
			angularjs.routes = getRoutes(angularjs);
			return angularjs;

			function initAngularjsElement(element) {
				var elements = initElements('angularjs.' + element, app);
				angularjs[element] = (angularjs[element] || []).concat(elements);
			}

			function getRoutes() {
				return angularjs.routes.map(fsService.addStartSlash).sort(compareIsDefault);
			}

			function compareIsDefault(r1, r2) {
				if (r1.isDefault && !r2.isDefault) return -1;
				if (!r1.isDefault && r2.isDefault) return 1;
				return 0;
			}
		}

		function initElements(propertyPath, app) {
			var elements = utils.getPropertyValue(app, propertyPath) || [];
			app.features.forEach(concatElements);
			return utils.arrays.distinct(elements);

			function concatElements(feature) {
				var featurePropertyValue = utils.getPropertyValue(feature, propertyPath) || [];
				if (Array.isArray(featurePropertyValue))
					elements = elements.concat(featurePropertyValue);
			}
		}

		return dis;
	});