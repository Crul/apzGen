define(['src/system/logger'], function (logger) {
	var fs = require('fs');
	var path = require('path');
	var pathPatterns = {
		//endsWithSlash: /.*\/$/,
		statrsWithSlash: /^\//
	};
	
	var dis = {};
	dis.pathPatterns = pathPatterns;
	dis.getFileInfo = getFileInfo;
	dis.getNameNoExtension = getNameNoExtension;
	dis.getFileExtension = getFileExtension;
	dis.writeFile = writeFile;
	dis.copyFolder = copyFolder;
	dis.clearFolder = clearFolder;
	dis.concatPath = concatPath;
	dis.getAllDeeps = getAllDeeps;

	var outputFolder = 'bin/';
	var fileInfoPatterns = {
		path: /([a-zA-Z]*\/)*/i,
		fileName: /[a-zA-Z]*\.[a-zA-Z]*/i,
		extension: /\.[a-zA-Z]*/i,
		nameNoExtension: /[a-zA-Z]*/i
	};
	
	function getFileInfo(fullPath) {
		var path = getFirstOrEmpty(fullPath, fileInfoPatterns.path);
		var pathLength = path.length;
		if (pathLength > 0) path = path.substring(0, pathLength - 1);

		var fileName = getFirstOrEmpty(fullPath, fileInfoPatterns.fileName) || fullPath;
		var extension = getFirstOrEmpty(fileName, fileInfoPatterns.extension);
		var nameNoExtension = getFirstOrEmpty(fileName, fileInfoPatterns.nameNoExtension);
		return { // TODO apzFile ?
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

	function writeFile(apzFile) {
		var filePath = apzFile.path;
		var fileName = apzFile.fileName;
		var content = apzFile.content;

		filePath = (filePath || '');
		if (filePath.match(pathPatterns.statrsWithSlash))filePath = filePath.substring(1);
		filePath = path.join(outputFolder, filePath);
		if (!fs.existsSync(filePath)) fs.mkdirSync(filePath);
		fs.writeFileSync(filePath + fileName, content);
		logger.log('writen: ' + filePath + fileName);
	}

	function copyFolder(src, dest) {
		copyRecursiveSync(src, dest);
	}

	function copyRecursiveSync(src, dest) {
		var exists = fs.existsSync(src);
		var stats = exists && fs.statSync(src);
		var isDirectory = exists && stats.isDirectory();
		if (!isDirectory) {
			fs.createReadStream(src).pipe(fs.createWriteStream(dest));
			return;
		}
		if (!fs.existsSync(dest)) fs.mkdir(dest);
		fs.readdirSync(src).forEach(function (childItemName) {
			copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
		});
	};

	function clearFolder(folder) {
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
	}

	function concatPath() {
		var pathArray = [];
		for (var i = 0; i < arguments.length; i++) pathArray.push(arguments[i]);
		return pathArray.filter(function (path) { return !!path; }).join('/');
	}

	function getAllDeeps(path) {
		var currentDeep = '';
		return path.split('/').map(function (token) {
			currentDeep += token + '/';
			return currentDeep;
		});
	}

	function getFirstOrEmpty(str, pattern) {
		var tokens = str.match(pattern);
		return (tokens && tokens.length > 0) ? tokens[0] : '';
	}

	return dis;
});