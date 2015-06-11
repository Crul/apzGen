define(
	[
		'src/engines/js/helpers/jsUtils',
		'src/engines/js/helpers/jsStrings', 
		'src/engines/js/helpers/jsFunctions'
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