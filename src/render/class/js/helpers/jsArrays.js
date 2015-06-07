define(['src/render/class/js/helpers/jsUtils', 'src/render/class/js/helpers/jsFunctions'],
	function (jsUtils, jsFunctions) {
		var dis = {};

		dis.value = jsUtils.renderWrap(arrayValue);
		dis.elementAt = jsUtils.renderWrap(elementAt);
		dis.indexOf = jsUtils.renderWrap(indexOf);

		function arrayValue(values) {
			if (values === undefined)
				values = [];

			if (!Array.isArray(values))
				values = [values];

			values = values.map(jsUtils.renderJsNoEol).join(', ');
			return '[' + values + ']';
		}

		function elementAt(array, position) {
			return jsUtils.renderJsNoEol(array) + arrayValue(position);
		}

		function indexOf(array, element) {
			return jsUtils.access(array, jsFunctions.execute('indexOf', element)).render();
		}

		return dis;
	});