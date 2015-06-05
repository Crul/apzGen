define(['src/system/logger'],
	function (logger) {
		var util = require('util');

		var dis = {};
		dis.create = create;
		dis.getFeaturesDefinitions = getFeaturesDefinitions;

		function create(definition) {
			var apzDefinition = {};

			apzDefinition.setTitle = setTitle;
			apzDefinition.addLibs = addLibs;
			apzDefinition.addEngines = addEngines;
			apzDefinition.addSeeds = addSeeds;
			apzDefinition.addFeatures = addFeatures;

			apzDefinition.definition = util._extend({}, definition);
			apzDefinition.definition.features = apzDefinition.definition.features || {};
			apzDefinition.definition.engines = apzDefinition.definition.engines || [];
			apzDefinition.definition.libs = apzDefinition.definition.libs || [];

			return apzDefinition; // fluent api
		}

		function setTitle(title) {
			this.definition.title = title;
			return this; // fluent api
		}

		function addLibs(libs) {
			libs = toArray(libs);
			this.definition.libs = concat(this.definition.libs, libs);
			return this; // fluent api
		}

		function addEngines(engines) {
			engines = toArray(engines);
			this.definition.engines = concat(this.definition.engines, engines);
			return this; // fluent api
		}

		function addSeeds(seedDefinitions) {
			seedDefinitions = processStringDefinition(seedDefinitions);
			if (seedDefinitions.featureName) {
				seedDefinitions = { foo: seedDefinitions };
			}
			if (seedDefinitions.features) {
				for (var featureName in seedDefinitions.features)
					seedDefinitions.features[featureName] = processStringDefinition(seedDefinitions.features[featureName]);
			}
			seedDefinitions = processFeaturesWithDefaultProperties('path', seedDefinitions);
			return this.addFeatures({ featureType: 'seed', features: seedDefinitions });
		}

		function addFeatures(featureDefinitions) {
			if (typeof (featureDefinitions) === 'string') {
				var _featureDefinitions = {};
				_featureDefinitions[featureDefinitions] = featureDefinitions;
				featureDefinitions = _featureDefinitions;
			}
			featureDefinitions = processFeaturesWithDefaultProperties('featureType', featureDefinitions);
			featureDefinitions = getFeaturesDefinitions(this, featureDefinitions);
			this.definition.features = util._extend(this.definition.features, featureDefinitions);
			return this; // fluent api
		}

		function processFeaturesWithDefaultProperties(propertyName, definitions) {
			var areFeaturesAndPropertyDefined = (definitions[propertyName] && definitions.features);
			if (!areFeaturesAndPropertyDefined)
				return definitions;

			for (var featureName in definitions.features) { // not [].forEach() because iterating {}
				definitions.features[featureName][propertyName] = definitions[propertyName];
			}
			return definitions.features;
		}

		function getFeaturesDefinitions(apzDefinition, featureDefinitions) {
			for (var featureName in featureDefinitions) { // not [].forEach() because iterating {}
				if (apzDefinition.definition.features[featureName])
					logger.error('apzDefinitionHelper.addFeatures: OVERWRITTING FEATURE : "' + featureName + '"');

				var featureDefinition = featureDefinitions[featureName];
				featureDefinition = processStringDefinition(featureDefinition);
				featureDefinitions[featureName] = featureDefinition;
			}
			return featureDefinitions;
		}

		function processStringDefinition(featureDefinitionConfig) {
			if (typeof (featureDefinitionConfig) === 'string')
				return { featureName: featureDefinitionConfig };

			return featureDefinitionConfig;
		}

		function toArray(obj) {
			if (!obj) return [];
			if (Array.isArray(obj)) return obj;
			return [obj];
		}

		function concat(array1, array2) {
			return (array1 || []).concat(array2 || []);
		}

		return dis;
	});