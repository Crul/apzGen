define(['src/system/logger'], function (logger) {
	var fs = require('fs');
	var path = require('path');
	var pathPatterns = {
		lastSlash: /\/$/,
		startsWithSlash: /^\\/
	};
	
	var dis = {};
	dis.pathPatterns = pathPatterns;
	dis.getFileInfo = getFileInfo;
	dis.getNameNoExtension = getNameNoExtension;
	dis.getFileExtension = getFileExtension;
	dis.writeFiles = writeFiles;
	dis.copyFolder = copyFolder;
	dis.clearFolder = clearFolder;
	dis.concatPath = concatPath;
	dis.getAllDeeps = getAllDeeps;

	var outputFolder = 'bin/';
	var fileInfoPatterns = {
		path: /([a-zA-Z]*\/)*/i,
		fileName: /[a-zA-Z|-]*\.[a-zA-Z]*/i,
		extension: /\.[a-zA-Z]*/i,
		nameNoExtension: /[a-zA-Z|-]*/i
	};
	
	function getFileInfo(fullPath) {
		var path = getFirstOrEmpty(fullPath, fileInfoPatterns.path);
		var pathLength = path.length;
		if (pathLength > 0) path = path.substring(0, pathLength - 1);

		var fileName = getFirstOrEmpty(fullPath, fileInfoPatterns.fileName) || fullPath;
		var extension = getFirstOrEmpty(fileName, fileInfoPatterns.extension);
		var nameNoExtension = getFirstOrEmpty(fileName, fileInfoPatterns.nameNoExtension);
		return {
			path: path,
			fileName: fileName,
			extension: extension,
			nameNoExtension: nameNoExtension
		};
	}
	
	function getNameNoExtension(fullPath){
		var fileName = getFirstOrEmpty(fullPath, fileInfoPatterns.fileName) || fullPath;
		return getFirstOrEmpty(fileName, fileInfoPatterns.nameNoExtension);
	}
	
	function getFileExtension(fullPath){
		var fileName = getFirstOrEmpty(fullPath, fileInfoPatterns.fileName) || fullPath;
		return getFirstOrEmpty(fileName, fileInfoPatterns.extension);
	}
	
	function writeFiles(apzFiles){		
		logger.log('writting apzFiles ...');
		apzFiles.forEach(writeFile);
	}

	function writeFile(apzFile) {
		var filePath = apzFile.path;
		var fileName = apzFile.fileName;
		var content = apzFile.content;

		filePath = (filePath || '');
		filePath = path.join(outputFolder, filePath);
		if (!fs.existsSync(filePath)) fs.mkdirSync(filePath);
		filePath = path.join(filePath, fileName);
		fs.writeFileSync(filePath, content);
		logger.debug('writen: ' + filePath);
	}

	function copyFolder(src, target) {
		logger.log('copying "'+ src + '" to "'+ target + '" ...');
		copyRecursiveSync(src, target);
	}

	function copyRecursiveSync(src, target) {
		var exists = fs.existsSync(src);
		var stats = exists && fs.statSync(src);
		var isDirectory = exists && stats.isDirectory();
		if (!isDirectory) {
			fs.createReadStream(src).pipe(fs.createWriteStream(target));
			return;
		}
		if (!fs.existsSync(target)) fs.mkdir(target);
		fs.readdirSync(src).forEach(_copyRecursiveSync);
		logger.debug('copied: ' + src + ', into: ' + target);
		
		function _copyRecursiveSync(childItemName) { // _ because naming collision
			copyRecursiveSync(path.join(src, childItemName), path.join(target, childItemName));
		}
	};

	function clearFolder(folder) {
		logger.log('clearing bin ...');
		if (fs.existsSync(folder)) removeFolder(folder);
		fs.mkdirSync(folder);
	}

	function removeFolder(folder) {
		// thanks! https://gist.github.com/tkihira/2367067
		var list = fs.readdirSync(folder);
		for (var i = 0; i < list.length; i++) {
			var nextPath = path.join(folder, list[i]);
			var stat = fs.statSync(nextPath);
			// skip these files
			if (nextPath == "." || nextPath == "..") {
			} else if (stat.isDirectory()) {
				// rmdir recursively
				removeFolder(nextPath);
			} else {
				// rm filename
				fs.unlinkSync(nextPath);
			}
		}
		fs.rmdirSync(folder);
		logger.debug('removed: ' + folder);
	}

	function concatPath() {
		var pathArray = [];
		for (var i = 0; i < arguments.length; i++) pathArray.push(arguments[i]);
		return pathArray.filter(isNotNull).map(removeEndingSlash).join('/');
	}
	
	function isNotNull(path){
		return !!path;
	}
	
	function removeEndingSlash(path){
		return path.replace(pathPatterns.lastSlash, '');
	}

	function getAllDeeps(path) {
		var currentDeep = '';
		return path.split('/').map(getCurrentPath);
		
		function getCurrentPath(token) {
			currentDeep += token + '/';
			return currentDeep;
		}
	}

	function getFirstOrEmpty(str, pattern) {
		var tokens = str.match(pattern);
		return (tokens && tokens.length > 0) ? tokens[0] : '';
	}

	return dis;
});