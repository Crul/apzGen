define([], function () {
	var dis = {};
	dis.create = create;
	var controllers = ['menu/menu.js'];

	function create(definition, appDefinition) {
		var menu = require('util')._extend({}, definition);
		
		var featureName = menu.featureName;		
		menu.apzFiles = getApzFiles(featureName);
		
		menu.angularjs = menu.angularjs || {};
		menu.angularjs.controllers = controllers;
		menu.angularjs.routes = getRoutes(featureName);
		menu.angularjs.model = menu.model || {};
		
		menu.excludeMenuOptions = menu.angularjs.routes.slice(0);
		
		return menu;
	}
	
	function getApzFiles(featureName){
		return [
			{ fileType: 'class', path: featureName, fileName: featureName },
			{ fileType: 'view', path: featureName, fileName: featureName },
		];
	}
	
	function getRoutes(featureName){
		return [{ // TODO: angularjsRouteFactory 
			path: featureName, 
			controller: featureName,
			template: featureName + '/' + featureName
		}];
	}

	return dis;
});