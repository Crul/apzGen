define(['src/render/class/js/helpers/jsUtils'], function (jsUtils) {
	var dis = {};

	dis.value = jsUtils.renderWrap(stringValue);
	dis.values = jsUtils.renderWrap(stringValues);

	function stringValue(value) {
		if (value === undefined)
			value = '';

		return "'" + jsUtils.renderJsNoEol(value) + "'";
	}

	function stringValues(values) {
		values = values || [];
		if (!Array.isArray(values))
			values = [values];
			
		return values.map(stringValue).join(',');
	}

	return dis;
});