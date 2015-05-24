function baseCtrlInitializer(context){
	var dis = {};
	dis.init = init;

	function init($scope, config){
		config = config || {};
		$scope.model =  $scope.model || {};
		
	}
	
	// TODO baseCtrlInitializer
	
	return dis;
}