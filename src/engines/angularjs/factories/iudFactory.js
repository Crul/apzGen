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

		function create(definition) {
			var iud = require('util')._extend({}, definition);
			initDependentFeatures(iud);
			initIud(iud);
			angularjsFeatureHelper.initFeature(iud, angularjsComponents);
			iud.getApzFiles = iudApzFilesFactory.createApzFiles;
			return iud;
		}

		function initIud(iud) {
			iud.entityName = iud.featureName;
			iud.controls = (iud.model || iud.fields).map(modelHelper.initModelField);
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