define([], function(){
	var dis = this;
	dis.read = read;

	var fs = require['fs'];
	function read(path){
		fs.readFileSync(path);
	}
	
	return dis;
});