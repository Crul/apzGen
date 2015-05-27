define(['src/system/fsService'], function (fsService) {
	var dis = {};
	dis.createRoutes = createRoutes;

	function createRoutes(features) {
		var routes = [];
		features.forEach(function (feature) {
			routes = routes.concat(createFeatureRoutes(feature));
		});
		routes.forEach(function (route) {
			if (!route.path.match(fsService.pathPatterns.starsWithSlash))
				route.path = '/' + route.path;
		});
		return routes;
	}

	function createFeatureRoutes(feature) {
		var featureName = feature.featureName;
		return feature.routes || [{
			path: featureName,
			template: featureName + '/' + featureName, // TODO access routes by properties
			controller: featureName
		}];
	}

	return dis;
});