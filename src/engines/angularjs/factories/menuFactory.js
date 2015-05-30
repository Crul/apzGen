define([], function () {
	var dis = {};
	dis.create = create;
	var controllers = ['menu/menu.js'];

	function create(definition, appDefinition) {
		var menu = require('util')._extend({}, definition);
		
		var featureName = menu.featureName;		
		menu.routes = getRoutes(featureName);
		menu.apzFiles = getApzFiles(featureName);
		menu.excludeMenuOptions = menu.routes.slice(0);
		menu.controllers = controllers;
		menu.model = menu.model || {};
		
		return menu;
	}
	
	function getRoutes(featureName){
		return [{ // TODO: angularjsRouteFactory 
			path: featureName, 
			controller: featureName,
			template: featureName + '/' + featureName
		}];
	}
	
	function getApzFiles(featureName){
		return [
			{ fileType: 'class', fileName: featureName },
			{ fileType: 'view', fileName: featureName },
		];
	}

	return dis;
});