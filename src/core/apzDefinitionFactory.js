define(['src/system/utils', 'src/system/logger', 'src/system/fsService', 'src/core/apzModel'],
	function (utils, logger, fsService, apzModel) {
		var util = require('util');
		var dis = {};
		dis.create = create;
		dis.initDefinition = initDefinition;

		function create(definition) {
			logger.log('creating apzDefinition ...');
			definition = getDefinition(definition);
			var apzDefinition = createApzDefinition(definition);
			definition.features.slice(0).forEach(_addFeatures);
			return apzDefinition;

			function _addFeatures(featureDefinition) {
				addFeatures(apzDefinition, featureDefinition);
			}
		}

		function getDefinition(definition) { // multiple returns
			if (definition)
				return definition;

			logger.trace('not definition provided: reading definition.json');
			return JSON.parse(fsService.readFile('definition.json'));
		}

		function createApzDefinition(definition) {
			var apzDefinition = util._extend({}, definition);
			apzDefinition.features = {};
			apzDefinition.engines = apzDefinition.engines || [];
			apzDefinition.libs = apzDefinition.libs || [];
			apzModel.init(apzDefinition);
			return apzDefinition;
		}

		function addFeatures(apzDefinition, newFeatureDefinitions) {
			var featureType;
			if (typeof (newFeatureDefinitions) === 'string') {
				featureType = newFeatureDefinitions;
				newFeatureDefinitions = {};
				newFeatureDefinitions[featureType] = featureType;
			} else {
				featureType = Object.keys(newFeatureDefinitions)[0];
				newFeatureDefinitions = newFeatureDefinitions[featureType];
			}

			var featureDefinitions = apzDefinition.features;
			for (var featureName in newFeatureDefinitions) { // not [].forEach() because iterating {}
				logger.debug('adding: ' + featureName);
				checkIfFeatureIsAlreadyAdded(featureDefinitions, featureName);
				var featureDefinition = getFeatureDefinition(newFeatureDefinitions[featureName], featureType);
				featureDefinitions[featureName] = featureDefinition;
				logger.trace('definition: ' + JSON.stringify(featureDefinition));
			}
		}

		function checkIfFeatureIsAlreadyAdded(featureDefinitions, featureName) {
			if (featureDefinitions[featureName])
				logger.error('apzDefinitionFactory.addFeatures: OVERWRITTING FEATURE : "' + featureName + '"');
		}

		function getFeatureDefinition(featureDefinition, featureType) {
			featureDefinition = createFromBasicTypes(featureDefinition, featureType);
			featureDefinition.featureType = featureType;
			return featureDefinition;
		}

		function initDefinition(definition, featureName) {
			definition = createFromBasicTypes(definition, featureName);
			definition.featureName = definition.featureName || featureName;
			return definition;
		}

		function createFromBasicTypes(definition, featureName) { // multiple returns
			switch (typeof (definition || {})) {
				case 'string':
					return { featureName: definition };
				case 'boolean':
					return {};
				default:
					return definition;
			}
		}

		return dis;
	});