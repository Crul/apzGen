// TODO rename apzFileFactory
define(['src/system/path'], function (path){
	var dis = {};
	dis.create = create;

	function create(feature, fileDefinitions, template) {
		return fileDefinitions.map(function(fileDefinition){
			if (typeof(fileDefinition) === 'string')
				return createFromPath(feature, fileDefinition);
			
			if (template)
				fileDefinition = require('util')._extend(fileDefinition, template);
			
			return createFileDefinition(fileDefinition.feature || feature, 
				fileDefinition.path, 
				fileDefinition.name, 
				fileDefinition.fileType,
				fileDefinition.renderer);
		});
	}
	
	function createFromPath(feature, fullPath){
		var fileInfo = path.getFileInfo(fullPath);
		var path = fileInfo.path;
		var name = fileInfo.name;
		return createFileDefinition(feature, path, name);
	}
	
	function createFileDefinition(feature, path, name, fileType, renderer){
		// TODO remove 'js', 'html' coupling... appContext
		fileType = fileType || (path.getFileInfo(name).extension == 'js' ? 'class' : 'view');
		
		if (path === undefined)
			path = name;
		
		if (name.indexOf('.') < 0) // TODO remove 'js', 'html' coupling... appContext
			name += '.' + (fileType == 'class' ? 'js' : 'html');
			
		return {
			feature: feature,
			fileType: fileType,
			path: path,
			name: name,
			renderer: renderer || feature.factory
		};
	}
	
	return dis;
});