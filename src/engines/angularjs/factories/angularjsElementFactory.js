define([], function () {
	var dis = {};
	dis.createElements = createElements;

	function createElements(elementObject, features) {
		var elements = [];
		features.forEach(concatElements);
		return elements;

		function concatElements(feature) {
			if (feature.angularjs)
				elements = elements.concat(feature.angularjs[elementObject] || []);
		}
	}

	return dis;
});