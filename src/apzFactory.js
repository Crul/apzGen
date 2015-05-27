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

		function create(appDefinition) {
			initApp(appDefinition);
			var features = createFeatures(appDefinition);
			var app = createFeature(appDefinition, features);
			app.features = features;
			return app;
		}

		function initApp(appDefinition) {
			apzContext.engines = appDefinition.engines || [];
			if (apzContext.engines.length == 0)
				appDefinition.engines.push(defaultEngine);

			appDefinition = definitionFactory.create(appDefinition, 'app');
		}

		function createFeatures(appDefinition) {
			var features = [];
			var featureDefinition;
			var featureDefinitions = appDefinition.features;
			for (var featureName in featureDefinitions) { // not [].map() because iterating {}
				featureDefinition = featureDefinitions[featureName];
				var clonedFeatureDefinition = require('util')._extend({}, featureDefinition);
				featureDefinitions[featureName] = (definitionFactory.create(featureDefinition, featureName) || {});
				featureDefinitions[featureName].definition = clonedFeatureDefinition;
			}
			for (var featureName in featureDefinitions) { // not [].map() because iterating {}
				featureDefinition = featureDefinitions[featureName];
				var feature = createFeature(featureDefinition, appDefinition);
				if (feature)
					features.push(feature || {});
				else 
					logger.error('FEATURE FACTORY NOT FOUND:\ndefinition: ' + JSON.stringify(featureDefinition))
			}
			return features;
		}

		function createFeature(definition, param) {
			var factory = factoryResolver.resolve(definition);
			if (factory) return factory.create(definition, param);
		}

		return dis;
	});