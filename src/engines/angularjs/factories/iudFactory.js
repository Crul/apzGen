define(
	[
		'src/engines/angularjs/factories/helpers/modelHelper',
		'src/engines/angularjs/factories/helpers/angularjsFeatureHelper',
		'src/engines/angularjs/factories/iud/iudApzFilesFactory'
	],
	function (modelHelper, angularjsFeatureHelper, iudApzFilesFactory) {
		var dis = {};
		dis.create = create;

		var angularjsComponents = [
			{ route: '/list', template: '-list', controller: 'List', menuOption: ' list' },
			{ route: '/edit/:id' }
		];

		function create(definition, apzDefinition) {
			var iud = require('util')._extend({}, definition);
			initDependentFeatures(iud);
			initIud(iud, apzDefinition.model);
			angularjsFeatureHelper.initFeature(iud, angularjsComponents);
			iud.getApzFiles = iudApzFilesFactory.createApzFiles;
			return iud;
		}

		function initIud(iud, model) {
			iud.entityName = iud.featureName;
			iud.preload = iud.preload || [];
			var controls = iud.controls || [];
			var fields = model.entities[iud.entityName].fields;
			iud.controls = fields.map(initControl);

			function initControl(field) {
				var fieldName = field.fieldName;
				var iudControl = controls.filter(getByFieldName);
				iudControl = iudControl.length > 0 ? iudControl[0] : {};
				return modelHelper.initControl(field, iudControl, iud.preload);

				function getByFieldName(control) {
					return control.fieldName == fieldName;
				}
			}
		}

		function initDependentFeatures(iud) {
			iud.dependentFeatures = iud.dependentFeatures || {};
			['base', 'list', 'iud'].forEach(setDependentFeature);

			function setDependentFeature(ctrlInitializer) {
				iud.dependentFeatures[ctrlInitializer] = {
					featureType: 'services/' + ctrlInitializer + 'Ctrl',
					featureName: ctrlInitializer + 'CtrlInitializer'
				};
			}
		}

		return dis;
	});