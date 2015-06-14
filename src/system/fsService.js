define(['src/system/logger'], function (logger) {
	var fs = require('fs');
	var path = require('path');
	var pathPatterns = {
		startsWithSlash: /^\\/,
		endsWithSlash: /\/$/
	};

	var dis = {};
	dis.getNameNoExtension = getNameNoExtension;
	dis.getFileExtension = getFileExtension;
	dis.exists = fs.existsSync;
	dis.readFile = fs.readFileSync;
	dis.readAllFiles = fs.readdirSync;
	dis.writeFiles = writeFiles;
	dis.clearFolder = clearFolder;
	dis.concatPath = concatPath;
	dis.getAllDeeps = getAllDeeps;
	dis.addStartSlash = addStartSlash;

	var fileInfoPatterns = {
		fileName: /[a-zA-Z|-]*\.[a-zA-Z]*/i,
		extension: /\.[a-zA-Z]*/i,
		nameNoExtension: /[a-zA-Z|-]*/i
	};

	function getNameNoExtension(fullPath) {
		var fileName = getFirstOrEmpty(fullPath, fileInfoPatterns.fileName) || fullPath;
		return getFirstOrEmpty(fileName, fileInfoPatterns.nameNoExtension);
	}

	function getFileExtension(fullPath) {
		var fileName = getFirstOrEmpty(fullPath, fileInfoPatterns.fileName) || fullPath;
		return getFirstOrEmpty(fileName, fileInfoPatterns.extension).substr(1);
	}

	function writeFiles(apzFiles, outputFolder) {
		apzFiles.forEach(writeFile);

		function writeFile(apzFile) {
			var filePath = apzFile.filePath;
			var content = apzFile.content;

			var indexOfFolderSeparator = Math.max(filePath.lastIndexOf('/'), filePath.lastIndexOf('\\'));
			if (indexOfFolderSeparator > 0) {
				var folderPath = concatPath(outputFolder, filePath.substring(0, indexOfFolderSeparator));
				getAllDeeps(folderPath).forEach(createPath);
			}
			filePath = path.join(outputFolder, filePath);
			fs.writeFileSync(filePath, content);
			logger.debug('written: ' + filePath);
		}
	}

	function createPath(_path) {
		if (fs.existsSync(_path)) return;
		fs.mkdirSync(_path);
		logger.debug('created: ' + _path);
	}

	function clearFolder(folder) {
		if (fs.existsSync(folder)) removeFolder(folder);
		fs.mkdirSync(folder);
	}

	function removeFolder(folder) {
		// thanks! https://gist.github.com/tkihira/2367067		
		dis.readAllFiles(folder).forEach(removeFolderContent);
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
		for (var i = 0; i < arguments.length; i++) // not [].forEach() because arguments is not an array
			pathArray.push(arguments[i]);
		return pathArray.filter(isNotNull).map(removeEndingSlash).join('/');
	}

	function isNotNull(path) {
		return !!path;
	}

	function removeEndingSlash(path) {
		return path.replace(pathPatterns.endsWithSlash, '');
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

	function addStartSlash(route) {
		if (!route.path.match(pathPatterns.startsWithSlash))
			route.path = '/' + route.path;
		return route;
	}

	return dis;
});