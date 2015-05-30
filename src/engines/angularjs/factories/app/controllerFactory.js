define([], function () {
	var dis = {};
	dis.createControllers = createControllers;

	function createControllers(features) {
		var controllers = [];
		features.forEach(concatControllers);
		return controllers;
		
		function concatControllers(feature) { // not [].map because [].concat()
			controllers = controllers.concat(feature.controllers || []);
		}
	}

	return dis;
});