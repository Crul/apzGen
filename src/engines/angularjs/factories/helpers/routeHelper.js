define([], function () {
	var dis = {};
	dis.getRoute = getRoute;

	function getRoute(featureName, component) {
		return {
			isDefault: component.isDefaultRoute,
			path: featureName + (component.route || ''),
			template: featureName + '/' + featureName + (component.template || ''),
			controller: featureName + (component.controller || '')
		};
	}

	return dis;
});