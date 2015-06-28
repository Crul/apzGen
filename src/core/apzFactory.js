define(['src/system/logger', 'src/core/apzContext', 'src/core/apzDefinitionFactory', 'src/core/apzFeatureFactory'],
	function (logger, apzContext, apzDefinitionFactory, apzFeatureFactory) {
		var util = require('util');
		var dis = {};
		dis.create = create;

		function create(apzDefinition) {
			logger.log('creating apz ...');
			apzContext.engines = apzDefinition.engines;
			apzDefinition = apzDefinitionFactory.initDefinition(apzDefinition, 'app');
			
			var featureFactory = apzFeatureFactory.getFeatureFactory(apzDefinition);
			var dependentFeatures = featureFactory.dependentFeatures;
			var featureDefinitions = util._extend(dependentFeatures || {}, apzDefinition.features);

			initFeatureDefinitions(featureDefinitions);
			createApzFeatures(apzDefinition, featureDefinitions);
			logger.debug('creating apz ...');
			return apzFeatureFactory.createFeature(apzDefinition);
		}

		function initFeatureDefinitions(featureDefinitions) {
			for (var featureName in featureDefinitions) { // not [].forEach() because iterating {}
				var featureDefinition = featureDefinitions[featureName];
				var clonedFeatureDefinition = util._extend({}, featureDefinition);
				featureDefinitions[featureName] = apzDefinitionFactory.initDefinition(featureDefinition, featureName);
				featureDefinitions[featureName].definition = clonedFeatureDefinition;
			}
		}

		function createApzFeatures(apzDefinition, featureDefinitions) {
			var featureArray = [];
			apzFeatureFactory.createRecursiveFeatures(apzDefinition, featureDefinitions, featureArray);
			apzDefinition.features = featureArray;
		}

		return dis;
	});