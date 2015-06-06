define(['src/render/class/js/jsFunctionRenderer'],
	function (jsFunctionRenderer) {
		var dis = require('util')._extend({}, jsFunctionRenderer);
		dis.render = render;
		dis.renderInitialization = renderInitialization;
		dis.renderModelInitializacion = renderModelInitializacion;

		function render(ctrlConfig) {
			var controllerName = ctrlConfig.controllerName;
			var body = ctrlConfig.body;
			var dependencies = ctrlConfig.dependencies;
			if (dependencies && !Array.isArray(dependencies))
				dependencies = [dependencies];
			dependencies = ['$scope'].concat(dependencies || []);
			return jsFunctionRenderer.render(controllerName, body, dependencies);
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
			return ctrlInitializer + '.init($scope);' + '\n';
		}

		function renderModelInitializacion(model) {
			model = JSON.stringify(model || {});
			return '$scope.model = ' + model + ';' + '\n';
		}

		return dis;
	});