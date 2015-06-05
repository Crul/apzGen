define(['src/engines/angularjs/factories/appFactory'],
	function (appFactory) {
		var dis = {};
		dis.create = create;

		var dependentFilesPath = 'seedwork/';
		var dependentServices = [
			'context',
			'dataservice',
			'notifier'
		];
		var dependentCtrlInitializers = [
			'baseCtrlInitializer',
			'listCtrlInitializer',
			'iudCtrlInitializer'
		];

		var dependentFeatures = getDependentFeatures();

		function create(definition, app) {
			var iud = require('util')._extend({}, definition);

			iud.dependentFeatures = dependentFeatures;
			iud.apzFiles = getApzFiles(iud.featureName);
			
			iud.angularjs = iud.angularjs || {};
			iud.angularjs.model = initModel(iud);
			iud.angularjs.routes = getRoutes(iud);			
			iud.angularjs.factories = getDependentFactories(app);
			iud.angularjs.controllers = getControllers(iud);
			iud.angularjs.menuOptions = getMenuOptions(iud);

			return iud;
		}

		function getDependentFeatures() {
			var _dependentFeatures = {};
			dependentServices.forEach(getSetDependentFileFn('services'));
			dependentCtrlInitializers.forEach(getSetDependentFileFn('controllers'));

			function getSetDependentFileFn(path) {
				return function setDependantFile(fileName) {
					var featureName = getDependentPath(path + '/' + fileName);
					_dependentFeatures[fileName] = { featureType: 'seed', featureName: featureName };
				};
			}
			return _dependentFeatures;
		}

		function getDependentFactories(app) {
			return dependentServices.map(getDependentPathFn('services'))
				.concat(dependentCtrlInitializers.map(getDependentPathFn('controllers')));
		}

		function getDependentPathFn(path) {
			return function _getDependentPath(fileName) {
				return getDependentPath(path + '/' + fileName);
			};
		}

		function getDependentPath(fileName) {
			return dependentFilesPath + fileName + '.js';
		}

		function initModel(iud) {
			var fields = iud.model || iud.fields;
			return { fields: fields.map(initModelField) };
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