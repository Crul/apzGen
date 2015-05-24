function listCtrlInitializer(baseCrlInitializer, context){
	var dis = {};
	dis.init = init;

	function init($scope, config){
		config = config || {};
		baseCrlInitializer.init($scope, config);
		
	}
	
	// TODO listCtrlInitializer
	
	return dis;
}