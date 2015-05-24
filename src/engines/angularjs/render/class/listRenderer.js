define(['src/engines/angularjs/render/class/ctrlRenderer'], 
	function (ctrlRenderer){
		var dis = {};
		dis.render = render;
		function render(definition){
			return ctrlRenderer.render(definition.name + 'List', 'listCtrlInitializer');
		}
		return dis;
		
	});