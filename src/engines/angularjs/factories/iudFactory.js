define(['src/system/logger'],
	function (logger) {
		var dis = {};
		dis.create = create;

		var requiredFeatures = ['context', 'dataservice', 'notifier'];

		var dependentFilesPath = 'seedwork/controllers/';
		var dependentFiles = ['baseCtrlInitializer', 'listCtrlInitializer', 'iudCtrlInitializer'];

		var dependentFeatures = {};
		dependentFiles.forEach(setDependentFile);

		function setDependentFile(fileName) {
			var featureName = getDependentPath(fileName);
			dependentFeatures[fileName] = { featureType: 'seed', featureName: featureName };
		}

		function create(definition, app) {
			var iud = require('util')._extend({}, definition);

			checkRequiredFeatures(app);
			setDependentFactories(app);

			iud.model = initModel(iud);
			iud.routes = getRoutes(iud);
			iud.controllers = getControllers(iud);
			iud.menuOptions = getMenuOptions(iud);
			iud.apzFiles = getApzFiles(iud.featureName);

			iud.dependentFeatures = dependentFeatures;

			return iud;
		}

		function setDependentFactories(app) {
			if (!app.angularjs)
				logger.error("iudFactory: angularJs NOT FOUND IN APP");

			app.angularjs.factories = (app.angularjs.factories || [])
				.concat(dependentFiles.map(getDependentPath));
		}

		function getDependentPath(fileName) {
			return dependentFilesPath + fileName + '.js';
		}

		function checkRequiredFeatures(app) {
			requiredFeatures.forEach(checkRequiredFeature);

			function checkRequiredFeature(requiredFeature) {
				if (!app.features[requiredFeature])
					logger.error('iudFactory.create: REQUIRED FEATURE NOT FOUND: ' + requiredFeature);
			}
		}

		function initModel(iud) {
			var fields = iud.model || iud.fields;
			fields = fields.map(initModelField);
			return { fields: fields };
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