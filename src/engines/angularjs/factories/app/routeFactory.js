define(['src/system/fsService'], function (fsService) {
	var dis = {};
	dis.createRoutes = createRoutes;

	function createRoutes(features) {
		var routes = [];
		features.forEach(function (feature) {
			routes = routes.concat(feature.routes || []);
		});
		return routes.map(function (route) {
			if (!route.path.match(fsService.pathPatterns.startsWithSlash))
				route.path = '/' + route.path;
			return route;
		});
	}

	return dis;
});