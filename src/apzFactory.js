define(
	[
		'src/system/logger',
		'src/system/definitionFactory',
		'src/resolve/factoryResolver',
		'src/apzContext'
	],
	function (logger, definitionFactory, factoryResolver, apzContext) {
		var util = require('util');
		var dis = {};
		dis.create = create;

		var defaultEngine = 'angularjs';

		function create(apzDefinition) {
			logger.log('creating apz ...');
			initApz(apzDefinition);
			var dependentFeatures = getFeatureFactory(apzDefinition).dependentFeatures;
			apzDefinition.features = createApzFeatures(apzDefinition, dependentFeatures);
			return createFeature(apzDefinition);
		}

		function initApz(apzDefinition) {
			apzContext.seedPath = 'seed' || apzDefinition.seedPath;
			apzContext.engines = apzDefinition.engines || [defaultEngine];
			apzDefinition = definitionFactory.create(apzDefinition, 'app');
		}

		function createApzFeatures(apzDefinition, dependentFeatures) {
			var featureDefinitions = util._extend(dependentFeatures || {}, apzDefinition.features);
			initFeatureDefinitions(featureDefinitions);
			var featureArray = [];
			createRecursiveFeatures(featureDefinitions, featureArray);
			return featureArray;
		}

		function initFeatureDefinitions(featureDefinitions) {
			for (var featureName in featureDefinitions) { // not [].forEach() because iterating {}
				var featureDefinition = featureDefinitions[featureName];
				var clonedFeatureDefinition = require('util')._extend({}, featureDefinition);
				featureDefinitions[featureName] = (definitionFactory.create(featureDefinition, featureName) || {});
				featureDefinitions[featureName].definition = clonedFeatureDefinition;
			}
		}

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

			return feature;
		}

		function getFeatureFactory(definition) {
			return factoryResolver.resolve(definition);
		}

		function addFeature(featureArray, featureToAdd) { // multiple returns
			if (featureArray.filter(getByFeatureName).length > 0) {
				logger.debug('skip duplicated feature: ' + featureToAdd.featureName);
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