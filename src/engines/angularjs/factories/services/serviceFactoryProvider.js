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
				var featureDefinition = initDefinition(definition);
				return initAngularjs(featureDefinition);
			}

			function initDefinition(definition) {
				var featureDefinition = { featureName: serviceName };
				featureDefinition.getApzFiles = getApzFiles;
				featureDefinition.libs = serviceConfig.libs;
				featureDefinition.aspects = serviceConfig.aspects;
				return featureDefinition;
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
