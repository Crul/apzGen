define(['src/system/logger'], function (logger) {
	var dis = {};
	dis.create = create;

	function create(definition, app) {
		if (!app.features.dataservice){
			logger.error('iudFactory.create: REQUIRED FEATURE NOT FOUND: dataservice' 
				+ '\nPlease define a "dataservice" feature'); // TODO logErrorService
			return;
		}			
		
		var iud = require('util')._extend({}, definition);
		
		initialize(iud);
		iud.routes = getRoutes(iud);
		iud.controllers = getControllers(iud);
		iud.menuOptions = getMenuOptions(iud);

		var path = iud.featureName;
		iud.apzFiles = [
			{ path: path, fileType: 'class', fileName: iud.featureName },
			{ path: path, fileType: 'view', fileName: iud.featureName },
			{ path: path, fileType: 'class', renderer: 'list', fileName: iud.featureName + 'List' },
			{ path: path, fileType: 'view', renderer: 'list', fileName: iud.featureName + '-list' }
		];
		return iud;
	}
	
	function initialize(iud) {
		iud.model = iud.model || [];
		if (Array.isArray(iud.model))
			iud.model = { fields: iud.model };
	}

	function getRoutes(iud) {
		var featureName = iud.featureName;
		// TODO: angularjsRouteFactory
		return [{ // TODO access routes by properties
			path: featureName + '/list',
			template: featureName + '/' + featureName + '-list',
			controller: featureName + 'List'
		}, {
				path: featureName + '/edit/:id',
				template: featureName + '/' + featureName,
				controller: featureName
			}];
	}

	function getControllers(iud) {
		var featureName = iud.featureName;
		return [
			featureName + '/' + featureName + '.js',
			featureName + '/' + featureName + 'List' + '.js'
		];
	}

	function getMenuOptions(iud) {
		var featureName = iud.featureName;
		return [
			{ path: featureName + '/list', optionName: featureName + ' list' },
			{ path: featureName + '/edit/new', optionName: 'new ' + featureName }
		];
	}

	return dis;
});