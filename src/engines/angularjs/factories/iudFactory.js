define(
	[
		'src/engines/angularjs/fileFactories/listCtrlJs',
		'src/engines/angularjs/fileFactories/listCtrlHtml',
		'src/engines/angularjs/fileFactories/iudCtrlJs',
		'src/engines/angularjs/fileFactories/iudCtrlHtml'
	],
	function (listCtrlJs, listCtrlHtml, iudCtrlJs, iudCtrlHtml) {
		var dis = {};
		dis.create = create;

		var ctrlInitializers = ['base', 'list', 'iud'];
		var _Ctrl = 'Ctrl';
		var _CtrlInitializer = _Ctrl + 'Initializer';
		var dependentFeatures = getDependentFeatures(ctrlInitializers);

		function create(definition) {
			var iud = require('util')._extend({}, definition);
			iud.dependentFeatures = dependentFeatures;
			iud.apzFiles = getApzFiles(iud);
			initAngularjs(iud);

			return iud;
		}

		function initAngularjs(iud) {
			iud.angularjs = iud.angularjs || {};

			var fields = iud.model || iud.fields;
			iud.angularjs.model = { fields: fields.map(initModelField) };

			iud.angularjs.routes = getRoutes(iud);
			iud.angularjs.controllers = getControllers(iud);
			iud.angularjs.menuOptions = getMenuOptions(iud);
		}

		function getDependentFeatures(ctrlInitializer) {
			var dependentFeatures = {};
			ctrlInitializer.forEach(setDependentFeature);
			return dependentFeatures;

			function setDependentFeature(ctrlInitializer) {
				dependentFeatures[ctrlInitializer + _Ctrl] = {
					featureType: 'ctrlInitializers/' + ctrlInitializer + _Ctrl,
					featureName: ctrlInitializer + _CtrlInitializer
				};
			}
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

		function getApzFiles(iud) {
			return [listCtrlJs, listCtrlHtml, iudCtrlJs, iudCtrlHtml].map(createApzFile);

			function createApzFile(fileFactory) {
				return fileFactory.create(iud);
			}
		}

		return dis;
	});