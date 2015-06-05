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
			apzDefinition.features = createApzFeatures(apzDefinition);
			return createFeature(apzDefinition);
		}

		function initApz(apzDefinition) {
			apzContext.seedPath = 'seed' || apzDefinition.seedPath;
			apzContext.engines = apzDefinition.engines || [defaultEngine];
			apzDefinition = definitionFactory.create(apzDefinition, 'app');
		}

		function createApzFeatures(apzDefinition) {
			initFeatureDefinitions(apzDefinition);
			var featureArray = [];
			createRecursiveFeatures(apzDefinition.features, featureArray);
			return featureArray;
		}

		function initFeatureDefinitions(apzDefinition) {
			var featureDefinitions = apzDefinition.features;
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
			var factory = factoryResolver.resolve(definition);
			if (!factory)
				return {}; // defensive (error logged in factoryResolver)

			var feature = factory.create(definition);
			if (!feature)
				logger.error('FEATURE FACTORY RETURNED UNDEFINED:\ndefinition: ' + JSON.stringify(definition));

			return feature;
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