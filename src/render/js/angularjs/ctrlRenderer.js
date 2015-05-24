define(['src/render/js/jsFunctionRenderer'], 
	function (jsFunctionRenderer){
		var dis = {};
		dis.render = render;
		dis.renderPublicFunction = renderPublicFunction;
		dis.renderCtrlInitialization = renderCtrlInitialization; 
		dis.renderModelInitializacion = renderModelInitializacion;
		dis.getFilename = jsFunctionRenderer.getFilename; 
				
		function render(definition){
			var body = definition.body || '';
			definition.dependencies = [ '$scope' ].concat(definition.dependencies || []);
			return jsFunctionRenderer.render(definition.name, body, definition.dependencies);
		}
		
		function renderCtrlInitialization(ctrlInitializer){
			ctrlInitializer = ctrlInitializer || 'ctrlInitializer';
			return ctrlInitializer + '.init($scope);' + '\n';
		}
		
		function renderModelInitializacion(model){
			model = JSON.stringify(model || {});
			return '$scope.model = ' + model + ';' + '\n';
		}
		
		function renderPublicFunction(name, body){
			return '$scope.' + name + ' = ' + name + ';' + '\n' +
				jsFunctionRenderer.render(name, body) + '\n';
		}
		
		return dis;
	});