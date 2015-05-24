define([], function(){
	var dis = {};
	dis.concatPath = concatPath;
	dis.getAllDeeps = getAllDeeps;
	dis.getFileInfo = getFileInfo;
		
	function concatPath(){
		var pathArray = [];
		for(var i = 0; i < arguments.length; i++) pathArray.push(arguments[i]);
		return pathArray.filter(function(path){ return !!path; }).join('/');	
	}
	
	function getAllDeeps(path){
		var currentDeep = '';
		return path.split('/').map(function(token){
			currentDeep += token + '/';
			return currentDeep;
		});
	}
	
	var pathPattern = /([a-zA-Z]*\/)*/i;
	var filePattern = /[a-zA-Z]*\.[a-zA-Z]*/i;
	var extensionPattern = /\.[a-zA-Z]*/i; 
	var nameNoExtensionPattern = /[a-zA-Z]*/i;
	function getFileInfo(fullPath){
		var path = fullPath.match(pathPattern)[0];
		var pathLength = path.length; 
		if (pathLength > 0) path = path.substring(0, pathLength - 1);
		
		var name = fullPath.match(filePattern)[0];
		var extension = name.match(extensionPattern);
		var nameNoExtension = name.match(nameNoExtensionPattern);
		return {
			path: path,
			name: name,
			extension: extension,
			nameNoExtension: nameNoExtension 
		};
	} 
	
	return dis;
});