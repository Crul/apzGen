define(['src/system/logger', 'src/core/apzResolver', 'src/core/apzAspectPipeline'],
	function (logger, apzResolver, apzAspectPipeline) {
		var dis = {};
		dis.createFeature = createFeature;
		dis.createRecursiveFeatures = createRecursiveFeatures;
		dis.getFeatureFactory = apzResolver.resolveFactory;

		function createRecursiveFeatures(apzDefinition, featureDefinitions, featureArray) {
			featureDefinitions = featureDefinitions || [];
			for (var featureName in featureDefinitions) { // not [].forEach() because iterating {}
				var featureDefinition = featureDefinitions[featureName];
				logger.debug('creating: ' + featureDefinition.featureName);
				var feature = createFeature(featureDefinition, apzDefinition);
				if (feature) {
					createRecursiveFeatures(apzDefinition, feature.dependentFeatures, featureArray);
					addFeature(featureArray, feature);
				}
			}
		}

		function createFeature(definition, apzDefinition) {
			var factory = apzResolver.resolveFactory(definition);
			var feature = (factory) ?
				factory.create(definition, apzDefinition) :
				apzResolver.resolveJson(definition);

			if (feature) {
				apzAspectPipeline.add(feature.aspects);
			} else {
				logger.error('apzFeatureFactory UNDEFINED FEATURE:');
				logger.error('definition: ' + JSON.stringify(definition));
			}
			return feature;
		}

		function addFeature(featureArray, featureToAdd) { // multiple returns
			if (featureArray.filter(getByFeatureName).length > 0) {
				logger.trace('duplicated feature skipped: ' + featureToAdd.featureName);
				return;
			}
			featureArray.push(featureToAdd);

			function getByFeatureName(feature) {
				return feature.featureName == featureToAdd.featureName;
			}
		}

		return dis;
	});