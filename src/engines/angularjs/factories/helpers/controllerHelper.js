define([], function () {
	var dis = {};
	dis.getController = getController;

	function getController(featureName, component) {
		return {
			filePath: featureName + '/' + featureName + (component.controller || '') + '.js',
			controllerName: featureName
		};
	}

	return dis;
});