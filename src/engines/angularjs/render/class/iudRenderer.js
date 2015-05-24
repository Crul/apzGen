define(['src/engines/angularjs/render/class/ctrlRenderer'], 
	function (ctrlRenderer){
		var dis = {};
		dis.render = render;
		function render(definition){
			return ctrlRenderer.renderInitialization(definition.name, 'iudCtrlInitializer');
		}
		return dis;
		
	});