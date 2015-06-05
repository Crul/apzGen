define([], function () {
	var dis = {};
	dis.log = log;
	dis.error = error;
	dis.debug = debug;
	dis.levels = {
		error: true,
		log: true,
		debug: true
	};

	function log(message) {
		if (!dis.levels.log) return;
		logToConsole({ message: message });
	}

	function error(message) {
		if (!dis.levels.error) return;
		logToConsole({ message: message, linePrefix: 'ERROR! ' });
	}

	function debug(message) {
		if (!dis.levels.debug) return;
		logToConsole({ message: message, linePrefix: '>      ' });
	}

	function logToConsole(messageOrConfig) {
		if (!console && !console.log) return;

		var config = messageOrConfig || '';
		if (typeof (messageOrConfig) === 'string')
			config = { message: messageOrConfig };

		if (!config.message) return;

		if (typeof (config.message) !== 'string')
			config.message = JSON.stringify(config.message);

		var linePrefix = config.linePrefix || '';
		var message = linePrefix + config.message.replace(/\n/g, '\n' + linePrefix);
		console.log(message);
	}

	return dis;
});