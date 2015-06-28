define(['src/core/apzContext', 'src/core/apzFileFactory'],
	function (apzContext, apzFileFactory) {
		var dis = {};
		dis.createFactory = createFactory;

		function createFactory(serviceConfig) {
			var factory = {};
			factory.create = create;

			var serviceName = serviceConfig.serviceName || 'fooFactory';
			var filePath = checkLastSlash(serviceConfig.path) + serviceName + '.js';
			var apzFileTemplate = apzContext.seedPath + '/' + filePath;

			function create(definition) {
				var feature = createFeature(definition);
				return initAngularjs(feature);
			}

			function createFeature(definition) {
				var feature = { featureName: serviceName };
				feature.getApzFiles = getApzFiles;
				feature.libs = serviceConfig.libs;
				feature.aspects = serviceConfig.aspects;
				return feature;
			}

			function getApzFiles() {
				return [apzFileFactory.create(filePath, apzFileTemplate)];
			}

			function initAngularjs(feature) {
				feature.angularjs = serviceConfig.angularjs || {};
				feature.angularjs.factories = feature.angularjs.factories || [];
				feature.angularjs.factories.push({
					filePath: filePath,
					factoryName: serviceName
				});
				return feature;
			}

			return factory;
		}

		function checkLastSlash(path) {
			path = (path || '');
			if (path && !path.match(/\/$/))
				path += '/';
			return path;
		}

		return dis;
	});
