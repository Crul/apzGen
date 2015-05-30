define(
	[
		'src/system/logger',
		'src/engines/angularjs/factories/appFactory'
	],
	function (logger, appFactory) {
		var dis = {};
		dis.create = create;

		var requiredAngularjsFactories = [
			'seedwork/services/dataservice.js',
			'seedwork/controllers/baseCtrlInitializer.js',
			'seedwork/controllers/listCtrlInitializer.js',
			'seedwork/controllers/iudCtrlInitializer.js'
		];

		function create(definition, app) {
			var iud = require('util')._extend({}, definition);

			appFactory.setFactories(app, requiredAngularjsFactories);

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
			return [
				{ // TODO access routes by properties
					path: featureName + '/list',
					template: featureName + '/' + featureName + '-list',
					controller: featureName + 'List'
				}, {
					path: featureName + '/edit/:id',
					template: featureName + '/' + featureName,
					controller: featureName
				}
			];
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
				{ path: featureName + '/list', optionName: featureName + ' list' }
			];
		}

		return dis;
	});