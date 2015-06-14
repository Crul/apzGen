define([], function () {
	var dis = {};
	dis.getArray = getArray;
	dis.getPropertyValue = getPropertyValue;
	dis.extendWithHelpers = extendWithHelpers;
	dis.arrays = {
		distinct: distinct
	};

	function getArray(param) {
		param = param || [];
		if (!Array.isArray(param))
			param = [param];
		return param;
	}

	function extendWithHelpers(dis, helpers) {
		helpers.forEach(setHelper);
		return dis;
		function setHelper(helper) {
			dis[helper.propertyName] = require(helper.filePath);
		}
	}

	function getPropertyValue(obj, propertyPath) {
		var propertyValue = obj;
		propertyPath.split('.').forEach(getCurrentPropertyValue);
		return propertyValue;

		function getCurrentPropertyValue(propertyName) {
			propertyValue = (propertyValue || {})[propertyName];
		}
	}

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