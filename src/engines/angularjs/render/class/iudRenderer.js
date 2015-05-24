define(['src/engines/angularjs/render/class/ctrlRenderer'], 
	function (ctrlRenderer){
		var dis = {};
		dis.render = render;
		function render(definition){
			return ctrlRenderer.renderIntialization(definition.name, 'iudCtrlInitializer');
		}
		return dis;
		
	});