define(['src/engines/js/jsFunctionRenderer'], 
	function (jsFunctionRenderer) {
		var dis = require('util')._extend({}, jsFunctionRenderer);
		dis.render = render; 
		dis.renderInitialization = renderInitialization;
		dis.renderModelInitializacion = renderModelInitializacion;
		
		function render(name, body, dependencies){
			dependencies = [ '$scope' ].concat(dependencies || []);
			return jsFunctionRenderer.render(name, body, dependencies);
		}
		
		function renderInitialization(name, ctrlInitializer, dependencies){
			dependencies = [ ctrlInitializer ].concat(dependencies || []);
			var functionBody = renderCtrlInitialization(ctrlInitializer);
			return render(name, functionBody, dependencies);
		}
		
		function renderCtrlInitialization(ctrlInitializer){
			ctrlInitializer = ctrlInitializer || 'ctrlInitializer';
			return ctrlInitializer + '.init($scope);' + '\n';
		}
		
		function renderModelInitializacion(model){
			model = JSON.stringify(model || {});
			return '$scope.model = ' + model + ';' + '\n';
		}
		
		return dis;
	});