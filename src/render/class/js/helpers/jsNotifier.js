define(['src/render/class/js/helpers/jsUtils', 'src/render/class/js/helpers/jsFunctions'],
	function (jsUtils, jsFunctions) {
		var dis = {};

		dis.notify = jsUtils.renderWrap(executeNotify);
		dis.confirm = jsUtils.renderWrap(executeConfirm);

		function executeNotify(message) {
			// TODO inject notifier
			return jsFunctions.execute('alert', '"' + message + '"').render();
		}

		function executeConfirm(message) {
			// TODO inject notifier
			return jsFunctions.execute('confirm', '"' + message + '"').render();
		}

		return dis;
	});