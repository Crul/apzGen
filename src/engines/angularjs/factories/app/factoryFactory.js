define([], function () {
	var dis = {};
	dis.createFactories = createFactories;

	function createFactories(features) {
		var factories = [];
		features.forEach(function (feature) { // not [].map because [].concat()
			factories = factories.concat(feature.factories || []);
		});
		return factories;
	}

	return dis;
});