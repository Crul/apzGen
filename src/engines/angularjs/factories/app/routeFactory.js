define(['src/system/fsService'], function (fsService) {
	var dis = {};
	dis.createRoutes = createRoutes;

	function createRoutes(features) {
		var routes = [];
		features.forEach(concatRoutes);
		return routes.map(addStartSlash);
		
		function concatRoutes(feature) {
			if (!feature.angularjs) return;
			routes = routes.concat(feature.angularjs.routes || []);
		}
		
		function addStartSlash(route) {
			if (!route.path.match(fsService.pathPatterns.startsWithSlash))
				route.path = '/' + route.path;
			return route;
		}
	}

	return dis;
});