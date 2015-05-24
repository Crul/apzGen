define([], function(){
	var pathPattern = /([a-zA-Z]*\/)*/i;
	var filePattern = /[a-zA-Z]*\.[a-zA-Z]*/i;
	var nameNoExtensionPattern = /[a-zA-Z]*/i; 
	return {
		getFileInfo: function(fullPath){
			var path = fullPath.match(pathPattern)[0];
			var pathLength = path.length; 
			if (pathLength > 0) path = path.substring(0, pathLength - 1);
			
			var name = fullPath.match(filePattern)[0];
			var nameNoExtension = name.match(nameNoExtensionPattern);
			return {
				path: path,
				name: name,
				nameNoExtension: nameNoExtension 
			};
		}	
	};
});