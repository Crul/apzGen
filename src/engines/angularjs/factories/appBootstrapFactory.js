define([], function () {
	var dis = {};
	dis.initElements = initElements;

	function initElements(elementObject, features) {
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