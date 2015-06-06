define([], function () {
	var dis = {};
	dis.arrays = {
		distinct: distinct
	};

	function distinct(array, compareFn) {
		compareFn = compareFn || compareValueFn;

		var newArray = [];
		(array || []).forEach(addIfNotExists);
		return newArray;

		function addIfNotExists(elemToAdd) {
			var existingElems = newArray.filter(function (elem) {
				return compareFn(elem, elemToAdd);
			}).length;
			
			if (existingElems === 0)
				newArray.push(elemToAdd);
		}

		function compareValueFn(a, b) {
			return a == b;
		}
	}

	return dis;
});