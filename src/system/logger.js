define([], function(){
	var dis = {};
	dis.log = log;
	
	function log(messageOrConfig){
		var config = messageOrConfig || '';
		if (typeof(messageOrConfig) === 'string')
			config = { message: messageOrConfig };
			
		if (!config.message) return;
		
		if (console && console.log)
			console.log('\t' + config.message);
	}
	
	return dis;
});