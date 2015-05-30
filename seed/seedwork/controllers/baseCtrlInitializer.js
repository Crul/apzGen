function baseCtrlInitializer($location, context, dataservice){
	var dis = {};
	dis.init = init;

	function init($scope, config){
		config = config || {};
		$scope.model =  $scope.model || {};
		$scope.dataservice = dataservice;
		$scope.pathTokens = getPathTokens();
		$scope.navigate = navigate;
	}
	
	function getPathTokens(){
		return ($location.$$path || '').split('/').filter(function(p){ return !!p; });
	}
	
	function navigate(to){
		$location.path(to);
	}
		
	return dis;
}