define(['src/system/logger', 'src/core/apzFactoryResolver', 'src/core/apzAspects'],
	function (logger, apzFactoryResolver, apzAspects) {
		var dis = {};
		dis.createRecursiveFeatures = createRecursiveFeatures;
		dis.createFeature = createFeature;
		dis.getFeatureFactory = getFeatureFactory;

		function createRecursiveFeatures(featureDefinitions, featureArray) {
			featureDefinitions = featureDefinitions || [];
			for (var featureName in featureDefinitions) { // not [].forEach() because iterating {}
				var featureDefinition = featureDefinitions[featureName];
				var feature = createFeature(featureDefinition);
				createRecursiveFeatures(feature.dependentFeatures, featureArray);
				addFeature(featureArray, feature);
			}
		}

		function createFeature(definition) { // multiple returns
			var factory = getFeatureFactory(definition);
			if (!factory) // defensive (error logged in factoryResolver)
				return {};

			var feature = factory.create(definition);
			if (!feature)
				logger.error('FEATURE FACTORY RETURNED UNDEFINED:\ndefinition: ' + JSON.stringify(definition));

			apzAspects.addAspects(feature.aspects);
			return feature;
		}

		function getFeatureFactory(definition) {
			return apzFactoryResolver.resolve(definition);
		}

		function addFeature(featureArray, featureToAdd) { // multiple returns
			if (featureArray.filter(getByFeatureName).length > 0) {
				logger.debug('skipped duplicated feature: ' + featureToAdd.featureName);
				return;
			}

			logger.debug('created: ' + featureToAdd.featureName);
			featureArray.push(featureToAdd);

			function getByFeatureName(feature) {
				return feature.featureName == featureToAdd.featureName;
			}
		}

		return dis;
	});