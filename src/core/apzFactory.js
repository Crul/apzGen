define(['src/system/logger', 'src/apzContext', 'src/core/apzDefinitionHelper', 'src/core/apzFeatureFactory'],
	function (logger, apzContext, apzDefinitionHelper, apzFeatureFactory) {
		var util = require('util');
		var dis = {};
		dis.create = create;

		function create(apzDefinition) {
			logger.log('creating apz ...');
			apzContext.engines = apzDefinition.engines;
			apzDefinition = apzDefinitionHelper.initDefinition(apzDefinition, 'app');
			return createApz(apzDefinition);
		}

		function createApz(apzDefinition) {
			var featureFactory = apzFeatureFactory.getFeatureFactory(apzDefinition);
			var dependentFeatures = featureFactory.dependentFeatures;
			var featureDefinitions = util._extend(dependentFeatures || {}, apzDefinition.features);

			initFeatureDefinitions(featureDefinitions);
			createApzFeatures(apzDefinition, featureDefinitions);
			return apzFeatureFactory.createFeature(apzDefinition);
		}

		function initFeatureDefinitions(featureDefinitions) {
			for (var featureName in featureDefinitions) { // not [].forEach() because iterating {}
				var featureDefinition = featureDefinitions[featureName];
				var clonedFeatureDefinition = util._extend({}, featureDefinition);
				featureDefinitions[featureName] = apzDefinitionHelper.initDefinition(featureDefinition, featureName);
				featureDefinitions[featureName].definition = clonedFeatureDefinition;
			}
		}

		function createApzFeatures(apzDefinition, featureDefinitions) {
			var featureArray = [];
			apzFeatureFactory.createRecursiveFeatures(featureDefinitions, featureArray);
			apzDefinition.features = featureArray;
		}

		return dis;
	});