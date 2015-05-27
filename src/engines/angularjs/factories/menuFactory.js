define(['src/factoryResolver'],
	function (factoryResolver) {
		var dis = {};
		dis.create = create;
		var controllers = ['menu/menu.js'];
		var excludeMenuOptions = ['menu'];

		function create(definition, appDefinition) {
			var menu = require('util')._extend({}, definition);
			menu.excludeMenuOptions = excludeMenuOptions;
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