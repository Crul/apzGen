define([], function () {
	var dis = {};
	dis.createFactories = createFactories;

	function createFactories(features) {
		var factories = [];
		features.forEach(concatFactories);
		return factories;
		
		function concatFactories(feature) { // not [].map because [].concat()
			factories = factories.concat(feature.factories || []);
		}
	}

	return dis;
});