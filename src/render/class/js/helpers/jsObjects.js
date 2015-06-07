define(['src/render/class/js/helpers/jsUtils'],
	function (jsUtils) {
		var dis = {};

		dis.value = jsUtils.renderWrap(valueObject);

		function valueObject(object) {
			return JSON.stringify(object);
		}

		return dis;
	});