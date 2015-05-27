define([], function(){
	var dis = {};
	dis.log = log;
	dis.error = error;
	dis.debug = debug;
	
	function log(messageOrConfig){
		if (!console && !console.log) return;
		
		var config = messageOrConfig || '';
		if (typeof(messageOrConfig) === 'string')
			config = { message: messageOrConfig };
			
		if (!config.message) return;
		
		var linePrefix = config.linePrefix || '\t';
		var message = linePrefix + config.message.replace(/\n/g, '\n' + linePrefix);
		console.log(message);
	}
	
	function error(message){
		log({ message: message, linePrefix: 'ERROR! '});
	}
	
	function debug(message){
		log({ message: message, linePrefix: '>      '});
	}
	
	return dis;
});