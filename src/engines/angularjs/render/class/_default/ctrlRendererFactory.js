define([], function () {

	return { create: create };

	function create(classRenderer) {
		var dis = require('util')._extend({}, classRenderer);
		var js = classRenderer;

		dis.angularjs = {};
		dis.angularjs.renderCtrl = renderCtrl;
		dis.angularjs.ctrlInitialization = ctrlInitialization;
		dis.angularjs.modelInitializacion = modelInitializacion;

		var $scope = '$scope';
		function renderCtrl(ctrlConfig) {
			ctrlConfig.functionName = ctrlConfig.functionName || ctrlConfig.controllerName;

			var dependencies = ctrlConfig.dependencies;
			if (dependencies && !Array.isArray(dependencies))
				dependencies = [dependencies];

			ctrlConfig.dependencies = [$scope].concat(dependencies || []);
			return dis.functions.render(ctrlConfig);
		}

		function ctrlInitialization(controllerName, ctrlInitializer, dependencies) {
			ctrlInitializer = ctrlInitializer || 'ctrlInitializer';
			var functionBody = js.concatJs(dis.functions.execute(js.access(ctrlInitializer, 'init'), $scope), js.constants.eol);
			dependencies = [ctrlInitializer].concat(dependencies || []);
			return renderCtrl({
				controllerName: controllerName,
				body: functionBody,
				dependencies: dependencies
			});
		}

		function modelInitializacion(model) {
			model = JSON.stringify(model || {});
			return js.concatJs(dis.variables.assign(js.access($scope, 'model'), model), js.constants.eol);
		}

		return dis;
	}
});