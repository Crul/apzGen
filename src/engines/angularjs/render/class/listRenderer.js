define(['src/engines/angularjs/render/class/ctrlRenderer'], 
	function (ctrlRenderer){
		var dis = {};
		dis.render = render;
		function render(feature){
			return ctrlRenderer.renderInitialization(feature.featureName + 'List', 'listCtrlInitializer');
		}
		return dis;
		
	});