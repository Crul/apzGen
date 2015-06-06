define(['src/render/class/js/jsRenderer'],
	function (js) {
		var dis = require('util')._extend({}, js);
		dis.render = render;
		dis.renderInitialization = renderInitialization;
		dis.renderModelInitializacion = renderModelInitializacion;

		var $scope = '$scope';
		function render(ctrlConfig) {
			var controllerName = ctrlConfig.controllerName;
			var body = ctrlConfig.body;
			var dependencies = ctrlConfig.dependencies;
			if (dependencies && !Array.isArray(dependencies))
				dependencies = [dependencies];
			dependencies = [$scope].concat(dependencies || []);
			return dis.functions.render(controllerName, body, dependencies);
		}

		function renderInitialization(controllerName, ctrlInitializer, dependencies) {
			dependencies = [ctrlInitializer].concat(dependencies || []);
			var functionBody = renderCtrlInitialization(ctrlInitializer);
			return render({
				controllerName: controllerName,
				body: functionBody,
				dependencies: dependencies
			});
		}

		function renderCtrlInitialization(ctrlInitializer) {
			ctrlInitializer = ctrlInitializer || 'ctrlInitializer';
			return dis.functions.execute(ctrlInitializer + '.init', $scope).render() + js.constants.eol;
		}

		function renderModelInitializacion(model) {
			model = JSON.stringify(model || {});
			return dis.variables.assign($scope + '.model', model).render() + js.constants.eol;
		}

		return dis;
	});