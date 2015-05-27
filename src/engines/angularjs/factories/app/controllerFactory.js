define([], function () {
	var dis = {};
	dis.createControllers = createControllers;

	function createControllers(features) {
		var controllers = [];
		features.forEach(function (feature) { // not [].map because [].concat()
			controllers = controllers.concat(feature.controllers || []);
		});
		return controllers;
	}

	return dis;
});