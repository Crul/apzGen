define([], function () {
	var dis = {};
	dis.createFactories = createFactories;

	function createFactories(features) {
		var factories = [];
		features.forEach(concatFactories);
		return factories;
		
		function concatFactories(feature) { // not [].map because [].concat()
			if (!feature.angularjs) return;
			factories = factories.concat(feature.angularjs.factories || []);
		}
	}

	return dis;
});