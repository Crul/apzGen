define(['src/render/class/js/helpers/jsUtils'], function (jsUtils) {
	var dis = {};

	dis.value = jsUtils.renderWrap(arrayValue);
	dis.elementAt = jsUtils.renderWrap(elementAt);
	dis.indexOf = jsUtils.renderWrap(indexOf);

	function arrayValue(values) {
		if (Array.isArray(values))
			values = values.join(', ');

		if (values === undefined)
			values = '';

		return '[' + values + ']';
	}

	function elementAt(array, position) {
		return array + arrayValue(position);
	}

	function indexOf(array, element) {
		return array + '.indexOf(' + element + ')';
	}

	return dis;
});