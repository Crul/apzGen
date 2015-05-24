function listCtrlInitializer(baseCtrlInitializer, context){
	var dis = {};
	dis.init = init;

	function init($scope, config){
		config = config || {};
		baseCtrlInitializer.init($scope, config);
		
	}
	
	// TODO listCtrlInitializer
	
	return dis;
}