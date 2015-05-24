define(['src/system/logger'], function(logger){
	var dis = this;
	dis.write = write;
	dis.copyFolder = copyFolder;
	
	var fs = require('fs');
	var path = require('path');
	function write(path, filename, content){
		if (!fs.existsSync(path))
            fs.mkdirSync(path);
		
		logger.log('fileWriter.write: ' + path + filename);
		fs.writeFileSync(path + filename, content);
	}
	
	function copyFolder(src, dest){
	 	copyRecursiveSync(src, dest);
	}
	
	var copyRecursiveSync = function(src, dest) {
		var exists = fs.existsSync(src);
		var stats = exists && fs.statSync(src);
		var isDirectory = exists && stats.isDirectory();
		if (!isDirectory) {
			fs.createReadStream(src).pipe(fs.createWriteStream(dest));
			return;
		}
		if (!fs.existsSync(dest)) fs.mkdir(dest);
		fs.readdirSync(src).forEach(function(childItemName) {
			copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
		});
	};
	
	return dis;
});