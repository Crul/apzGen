define([], function () {
	var dis = {};
	dis.create = create;
	var controllers = ['menu/menu.js'];

	function create(definition) {
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

	function getApzFiles(featureName) {
		return [getApzFile('class', featureName), getApzFile('view', featureName)];
	}

	function getApzFile(fileType, featureName) {
		return { fileType: fileType, path: featureName, fileName: featureName };
	}

	function getRoutes(featureName) {
		return [{ // TODO: angularjsRouteFactory 
			isDefault: true,
			path: featureName,
			controller: featureName,
			template: featureName + '/' + featureName
		}];
	}

	return dis;
});