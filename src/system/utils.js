define([], function () {
	var dis = {};
	dis.getArray = getArray;
	dis.getPropertyValue = getPropertyValue;
	dis.extendWithHelpers = extendWithHelpers;
	dis.objects = {
		toArray: objectToArray
	};
	dis.arrays = {
		concat: concatArrays,
		distinct: distinct,
		getRegexFilter: getRegexFilter
	};

	function getArray(param) {
		param = param || [];
		if (!Array.isArray(param))
			param = [param];
		return param;
	}

	function objectToArray(obj) { // multiple returns
		if (!obj) return [];
		if (Array.isArray(obj)) return obj;
		return [obj];
	}

	function concatArrays(array1, array2) {
		return (array1 || []).concat(array2 || []);
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
	}

	function compareValueFn(a, b) {
		return a == b;
	}

	function getRegexFilter(pattern) {
		if (typeof (pattern) === 'string')
			pattern = new RegExp(pattern);
		return filterByExtesion;

		function filterByExtesion(file) {
			return (file.filePath || file).match(pattern);
		}
	}

	return dis;
});