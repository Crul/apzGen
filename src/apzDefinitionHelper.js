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

			return apzDefinition;
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

		function addSeeds(seedName, seedDefinition) {
			seedDefinition = processStringDefinition(seedDefinition);
			seedDefinition.featureType = 'seed';
			var featureDefinition = wrapInObject(seedDefinition, seedName);
			return this.addFeatures(featureDefinition);
		}

		function wrapInObject(value, propertyName) {
			var obj = {};
			obj[propertyName || value] = value;
			return obj;
		}

		function addFeatures(featureDefinitions) {
			if (typeof (featureDefinitions) === 'string') {
				featureDefinitions = wrapInObject(featureDefinitions);
			}
			featureDefinitions = getFeaturesWithDefaultPropertiesIfProceed(featureDefinitions);
			featureDefinitions = getFeaturesDefinitions(this, featureDefinitions);
			this.definition.features = util._extend(this.definition.features, featureDefinitions);
			return this; // fluent api
		}

		function getFeaturesWithDefaultPropertiesIfProceed(definitions) { // multiple returns
			var areDefaultPropertiesDefined = definitions.features;
			if (!areDefaultPropertiesDefined)
				return definitions;

			for (var propertyName in definitions) { // not [].forEach() because iterating {}
				if (propertyName !== 'feature')
					fillProperty(definitions, propertyName);
			}
			return definitions.features;
		}

		function fillProperty(definitions, propertyName) {
			var features = definitions.features;
			var propertyValue = definitions[propertyName];
			for (var featureName in features) { // not [].forEach() because iterating {}
				features[featureName][propertyName] = propertyValue;
			}
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

		function processStringDefinition(featureDefinitionConfig) { // multiple returns
			if (typeof (featureDefinitionConfig) === 'string')
				return { featureName: featureDefinitionConfig };

			return featureDefinitionConfig;
		}

		function toArray(obj) { // multiple returns
			if (!obj) return [];
			if (Array.isArray(obj)) return obj;
			return [obj];
		}

		function concat(array1, array2) {
			return (array1 || []).concat(array2 || []);
		}

		return dis;
	});