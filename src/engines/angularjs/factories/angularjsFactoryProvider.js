define(['src/apzContext', 'src/code/jsParser'],
	function (apzContext, jsParser) {
		var dis = {};
		dis.createFactory = createFactory;

		function createFactory(factoryConfig) {
			var factory = {};
			factory.create = create;

			var path = (factoryConfig.path || '');
			if (path && !path.match(/\/$/))
				path += '/';

			var factoryName = factoryConfig.factoryName || 'fooFactory';
			var filePath = path + factoryName + '.js';
			var apzFile = {
				filePath: filePath,
				getDefinition: getFileDefinition
			};

			function create(definition) {
				var feature = { featureName: factoryName };
				feature.apzFiles = [apzFile];
				feature.libs = factoryConfig.libs;
				feature.aspects = factoryConfig.aspects;
				feature.angularjs = factoryConfig.angularjs || {};
				feature.angularjs.factories = feature.angularjs.factories || [];
				if (!feature.angularjs.notFactory)
					feature.angularjs.factories.push(filePath);
				return feature;
			}

			function getFileDefinition() {
				return jsParser.parse(apzContext.seedPath + '/' + filePath);
			}

			return factory;
		}

		return dis;
	});
