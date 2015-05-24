function iudCtrlInitializer(baseCrlInitializer, context){
	var dis = {};
	dis.init = init;

	function init($scope, config){
		config = config || {};
		baseCrlInitializer.init($scope, config);
		
		$scope.canSave = canSave;
		$scope.save = save;
	}
	
	function save(){
		if (!canSave()) {
			alert('you cannot save');
			return;
		}
		alert('saved!');
	}
	
	function canSave(){
		return true;
	}
	
	// TODO listCtrlInitializer
	
	return dis;
}