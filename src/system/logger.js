define([], function () {
	var dis = {};
	dis.error = error;
	dis.log = log;
	dis.debug = debug;
	dis.trace = trace;
	dis.levels = {};
	dis.levels.error = true;
	dis.levels.log = true;
	dis.levels.debug = dis.levels.log && false;
	dis.levels.trace = dis.levels.debug && false;

	function log(message) {
		if (dis.levels.debug)
			message = '\n' + message;

		logToConsole('log', message);
	}

	function error(message) {
		logWithPrefix('error', message, 'ERROR! ');
	}

	function debug(message) {
		logWithPrefix('debug', message, '  ');
	}

	function trace(message) {
		logWithPrefix('trace', message, '    ');
	}

	function logWithPrefix(logLevel, message, linePrefix) {
		message = stringifyIfProceed(message);
		var config = getConfigFromString(message);
		config.linePrefix = linePrefix;
		logToConsole(logLevel, config);
	}

	function logToConsole(logLevel, messageOrConfig) {
		if (!dis.levels[logLevel] || !console && !console.log)
			return;

		var config = getConfigFromString(messageOrConfig);
		var message = stringifyIfProceed(config.message);

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

	function stringifyIfProceed(message) {
		if (typeof (message) !== 'string')
			message = JSON.stringify(message);
		return message;
	}

	return dis;
});