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

			iud.model = initModel(iud.model);
			iud.routes = getRoutes(iud);
			iud.controllers = getControllers(iud);
			iud.menuOptions = getMenuOptions(iud);
			iud.apzFiles = getApzFiles(iud.featureName);

			return iud;
		}

		function initModel(model) {
			model = model || [];
			if (Array.isArray(model))
				model = { fields: model };
			model.fields = model.fields.map(initModelField);
			return model;
		}

		function initModelField(field) {
			if (typeof (field) === 'string')
				field = { fieldName: field };
			field.fieldType = field.fieldType || 'text';
			return field;
		}

		// TODO unify routes/controllers/menuOptions/apzFiles definition
		function getRoutes(iud) {
			var featureName = iud.featureName;
			// TODO: angularjsRouteFactory
			return [
				{
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

		function getApzFiles(featureName) {
			var path = featureName;
			return [
				{ path: path, fileType: 'class', fileName: featureName },
				{ path: path, fileType: 'view', fileName: featureName },
				{ path: path, fileType: 'class', renderer: 'list', fileName: featureName + 'List' },
				{ path: path, fileType: 'view', renderer: 'list', fileName: featureName + '-list' }
			];
		}

		return dis;
	});