define([], function () {
	var dis = {};
	dis.create = create;

	function create(definition, featureName) {
		definition = createFromBasicTypes(definition, featureName);
		definition.featureName = definition.featureName || featureName;
		definition.apzFiles = [];
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