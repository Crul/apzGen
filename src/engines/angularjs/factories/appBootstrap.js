define(['src/system/utils', 'src/system/fsService'],
	function (utils, fsService) {
		var dis = {};
		dis.initAngularjs = initAngularjs;
		dis.initFeature = initFeature;

		var angularjsElements = ['routes', 'config', 'factories', 'controllers', 'dependencies'];
		function initAngularjs(app) {
			app.libs = getThirdPartyLibs(app);
			app.angularjs = app.angularjs || {};
			angularjsElements.forEach(initAngularjsElement);
			app.angularjs.routes = app.angularjs.routes.map(fsService.addStartSlash);

			function initAngularjsElement(elementsName) {
				app.angularjs[elementsName] = initElements('angularjs.' + elementsName, app);
			}
		}

		function initFeature(app, fileFactories) {
			app.featureName = app.appName || app.featureName || 'apzApp';
			var files = fileFactories.map(createFile);
			app.apzFiles = getApzFiles(app, files);

			function createFile(fileFactory) {
				return fileFactory.create(app);
			}
		}

		function getThirdPartyLibs(app) {
			var libs = (app.libs || []).concat(initElements('libs', app));
			return utils.arrays.distinct(libs);
		}

		function getApzFiles(app, extraFiles) {
			var apzFiles = (app.apzFiles || []).concat(extraFiles);
			return utils.arrays.distinct(apzFiles);
		}

		function initElements(propertyPath, app) {
			var elements = utils.getPropertyValue(app, propertyPath) || [];
			app.features.forEach(concatElements);

			return utils.arrays.distinct(elements);

			function concatElements(feature) {
				var featurePropertyValue = utils.getPropertyValue(feature, propertyPath) || [];
				if (Array.isArray(featurePropertyValue)) {
					elements = elements.concat(featurePropertyValue);
				}
			}
		}

		return dis;
	});