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
	dis.readFile = readFile;
	dis.readAllFiles = readAllFiles;
	dis.writeFiles = writeFiles;
	dis.clearFolder = clearFolder;
	dis.concatPath = concatPath;
	dis.getAllDeeps = getAllDeeps;

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

	function getNameNoExtension(fullPath) {
		var fileName = getFirstOrEmpty(fullPath, fileInfoPatterns.fileName) || fullPath;
		return getFirstOrEmpty(fileName, fileInfoPatterns.nameNoExtension);
	}

	function getFileExtension(fullPath) {
		var fileName = getFirstOrEmpty(fullPath, fileInfoPatterns.fileName) || fullPath;
		return getFirstOrEmpty(fileName, fileInfoPatterns.extension);
	}

	function readFile(filePath) {
		return fs.readFileSync(filePath);
	}

	function readAllFiles(folder) {
		return fs.readdirSync(folder);
	}

	function writeFiles(apzFiles, outputFolder) {
		apzFiles.forEach(writeFile);

		function writeFile(apzFile) {
			var filePath = apzFile.path;
			var fileName = apzFile.fileName;
			var content = apzFile.content;

			filePath = (filePath || '');
			filePath = path.join(outputFolder, filePath);

			getAllDeeps(filePath).forEach(createPath);
			var indexOfFolderSeparator = Math.max(fileName.lastIndexOf('/'), fileName.lastIndexOf('\\'));
			if (indexOfFolderSeparator > 0) {
				var pathFromFileName = concatPath(outputFolder, fileName.substring(0, indexOfFolderSeparator));
				getAllDeeps(pathFromFileName).forEach(createPath);
			}

			filePath = path.join(filePath, fileName);
			fs.writeFileSync(filePath, content);
			logger.debug('writen: ' + filePath);
		}
	}

	function createPath(_path) {
		if (fs.existsSync(_path)) return;
		fs.mkdirSync(_path);
		logger.debug('folder created: ' + _path);
	}

	function clearFolder(folder) {
		if (fs.existsSync(folder)) removeFolder(folder);
		fs.mkdirSync(folder);
	}

	function removeFolder(folder) {
		// thanks! https://gist.github.com/tkihira/2367067		
		readAllFiles(folder).forEach(removeFolderContent);
		fs.rmdirSync(folder);
		logger.debug('removed: ' + folder);

		function removeFolderContent(element) {
			var nextPath = path.join(folder, element);
			var stat = fs.statSync(nextPath);
			if (nextPath == "." || nextPath == "..") {
				// skip these files
			} else if (stat.isDirectory()) {
				// rmdir recursively
				removeFolder(nextPath);
			} else {
				// rm filename
				fs.unlinkSync(nextPath);
			}
		}
	}

	function concatPath() {
		var pathArray = [];
		for (var i = 0; i < arguments.length; i++) // not [].forEach() because arguments is not an array (it only has length property)
			pathArray.push(arguments[i]);
		return pathArray.filter(isNotNull).map(removeEndingSlash).join('/');
	}

	function isNotNull(path) {
		return !!path;
	}

	function removeEndingSlash(path) {
		return path.replace(pathPatterns.lastSlash, '');
	}

	function getAllDeeps(path) {
		var currentDeep = '';
		return path.replace(/\\/g, '/').split('/').map(getCurrentPath);

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