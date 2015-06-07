define(
	[
		'src/render/class/js/helpers/jsUtils',
		'src/render/class/js/helpers/jsStrings', 
			'src/render/class/js/helpers/jsFunctions'
	],
	function (jsUtils, jsStrings, jsFunctions) {
		var dis = {};

		dis.notify = jsUtils.renderWrap(executeNotify);
		dis.confirm = jsUtils.renderWrap(executeConfirm);

		function executeNotify(message) {
			message = jsStrings.value(message);
			return jsFunctions.execute('alert', message).render();
		}

		function executeConfirm(message) {
			message = jsStrings.value(message);
			return jsFunctions.execute('confirm', message).render();
		}

		return dis;
	});