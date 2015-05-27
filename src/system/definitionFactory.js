define(['src/system/logger'], function (logger) {
	var dis = {};
	dis.create = create;

	function create(definition, featureName) {
		definition = definition || {};
		definition = createFromBasicTypes(definition, featureName);

		definition.definitionFeatureName = featureName;
		definition.featureName = definition.featureName || featureName;
		if (typeof (definition.featureName) !== 'string')
			logger.error('definitionFactory.init invalid featureName: ' + definition.featureName);

		definition.apzFiles = [];
		return definition;
	}

	function createFromBasicTypes(definition, featureName) { // multiple returns
		var typeOfDefinition = typeof (definition);
		if (typeOfDefinition === 'string')
			return { featureName: definition };
		else if (typeOfDefinition === 'boolean')
			return { featureName: featureName };

		return definition;
	}

	return dis;
});