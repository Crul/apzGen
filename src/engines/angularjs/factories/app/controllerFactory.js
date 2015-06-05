define([], function () {
	var dis = {};
	dis.createControllers = createControllers;

	function createControllers(features) {
		var controllers = [];
		features.forEach(concatControllers);
		return controllers;
		
		function concatControllers(feature) { // not [].map because [].concat()
			if (!feature.angularjs) return;
			controllers = controllers.concat(feature.angularjs.controllers || []);
		}
	}

	return dis;
});