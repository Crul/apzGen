define(
	[
		'src/system/logger',
		'src/system/definitionFactory',
		'src/factoryResolver',
		'src/apzContext'
	],
	function (logger, definitionFactory, factoryResolver, apzContext) {
		var dis = {};
		dis.create = create;

		var defaultEngine = 'angularjs';

		function create(apzDefinition) {
			logger.log('creating apz ...');
			initApz(apzDefinition);
			var features = createApzFeatures(apzDefinition);
			var apz = createFeature(apzDefinition, features);
			apz.features = features;
			return apz;
		}

		function initApz(apzDefinition) {
			apzContext.seedPath = 'seed' || apzDefinition.seedPath;
			apzContext.engines = apzDefinition.engines || [];
			if (apzContext.engines.length === 0)
				apzDefinition.engines.push(defaultEngine);

			apzDefinition = definitionFactory.create(apzDefinition, 'app');
		}

		function createApzFeatures(apzDefinition) {
			initFeatureDefinitions(apzDefinition);
			return createFeatures(apzDefinition, apzDefinition.features);
		}

		function initFeatureDefinitions(apzDefinition) {
			var featureDefinitions = apzDefinition.features;
			for (var featureName in featureDefinitions) { // not [].map() because iterating {}
				var featureDefinition = featureDefinitions[featureName];
				var clonedFeatureDefinition = require('util')._extend({}, featureDefinition);
				featureDefinitions[featureName] = (definitionFactory.create(featureDefinition, featureName) || {});
				featureDefinitions[featureName].definition = clonedFeatureDefinition;
			}
		}

		function createFeatures(apzDefinition, featureDefinitions) { // two params to allow recursivity
			var features = [];
			if (!featureDefinitions) return features;
			for (var featureName in featureDefinitions) { // not [].map() because iterating {}
				var featureDefinition = featureDefinitions[featureName];
				var feature = createFeature(featureDefinition, apzDefinition);				
				var dependentFeatures = createFeatures(apzDefinition, feature.dependentFeatures);
				addFeatures(features, dependentFeatures);				
				addFeatures(features, feature);
			}
			return features;
		}

		function addFeatures(featureArray, featuresToAdd) {
			if (!Array.isArray(featuresToAdd))
				featuresToAdd = [featuresToAdd];

			featuresToAdd.forEach(addFeature);

			function addFeature(featureToAdd) {
				if (featureArray.filter(getByFeatureName).length > 0) {
					logger.debug('skip duplicated feature: ' + featureToAdd.featureName);
					return;
				}
				featureArray.push(featureToAdd);

				function getByFeatureName(feature) {
					return feature.featureName == featureToAdd.featureName;
				}
			}
		}

		function createFeature(definition, param) {
			var factory = factoryResolver.resolve(definition);
			if (!factory) return {}; // defensive
			var feature = factory.create(definition, param) || {};
			if (feature) logger.debug('created: ' + feature.featureName);
			else logger.error('FEATURE FACTORY RETURNED UNDEFINED:\ndefinition: ' + JSON.stringify(definition));
			return feature;
		}

		return dis;
	});