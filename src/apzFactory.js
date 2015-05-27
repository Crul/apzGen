define(
	[
		'src/apzContext',
		'src/system/definitionFactory',
		'src/factoryResolver'
	],
	function (apzContext, definitionFactory, factoryResolver) {
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

			appDefinition = definitionFactory.init(appDefinition, 'app');
		}

		function createFeatures(appDefinition) {
			var features = [];
			var featureDefinitions = appDefinition.features;
			for (var featureName in featureDefinitions) { // not [].map() because iterating {}
				var featureDefinition = featureDefinitions[featureName];
				var clonedFeatureDefinition = require('util')._extend({}, featureDefinition);
				featureDefinitions[featureName] = definitionFactory.init(featureDefinition, featureName);
				featureDefinitions[featureName].definition = clonedFeatureDefinition;
			}
			for (var featureName in featureDefinitions) { // not [].map() because iterating {}
				var feature = createFeature(featureDefinitions[featureName], appDefinition);
				features.push(feature);
			}
			return features;
		}

		function createFeature(definition, param) {
			return factoryResolver.resolve(definition).create(definition, param);
		}

		return dis;
	});