define([], function () {
	var dis = {};
	dis.create = create;
	var controllers = ['menu/menu.js'];

	function create(definition, appDefinition) {
		var menu = require('util')._extend({}, definition);
		var featureName = menu.featureName;
		menu.routes = [{ // TODO: angularjsRouteFactory 
			path: featureName, 
			controller: featureName,
			template: featureName + '/' + featureName
		}];;
		menu.excludeMenuOptions = menu.routes.slice(0);
		menu.controllers = controllers;
		menu.model = menu.model || {};
		menu.apzFiles = [
			{ fileType: 'class', fileName: menu.featureName },
			{ fileType: 'view', fileName: menu.featureName },
		];
		return menu;
	}

	return dis;
});