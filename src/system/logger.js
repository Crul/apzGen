define([], function () {
	var dis = {};
	dis.log = log;
	dis.error = error;
	dis.debug = debug;
	dis.levels = {
		error: true,
		log: true,
		debug: false
	};

	function log(message) {
		logToConsole('log', message);
	}

	function error(message) {
		logWithPrefix('error', message, 'ERROR! ');
	}

	function debug(message) {
		logWithPrefix('debug', message, '>      ');
	}

	function logWithPrefix(logLevel, messageOrConfig, linePrefix) {
		var config = getConfigFromString(messageOrConfig);
		config.linePrefix = linePrefix;
		logToConsole(logLevel, config);
	}

	function logToConsole(logLevel, messageOrConfig) {
		if (!dis.levels[logLevel] || !console && !console.log)
			return;

		var config = getConfigFromString(messageOrConfig);
		var message = config.message;
		if (typeof (message) !== 'string')
			message = JSON.stringify(message);

		var linePrefix = config.linePrefix || '';
		message = linePrefix + message.replace(/\n/g, '\n' + linePrefix);
		console.log(message);
	}

	function getConfigFromString(messageOrConfig) { // multiple returns
		if (typeof (messageOrConfig) === 'string')
			return { message: messageOrConfig };
		else
			return messageOrConfig || { message: '' };
	}

	return dis;
});