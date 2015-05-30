function listCtrlInitializer(baseCtrlInitializer, context){
	var dis = {};
	dis.init = init;

	function init($scope, config){
		config = config || {};
		baseCtrlInitializer.init($scope, config);
		
		$scope.entityName = $scope.pathTokens[0];
		$scope.edit = edit;
		$scope.remove = remove;
		
		loadList($scope);
		
	}
	
	function loadList($scope){
		$scope.dataservice.getAll($scope.entityName).then(_listLoaded);
		function _listLoaded(response){
			return listLoaded($scope, response);
		}
	}
	
	function listLoaded($scope, response) {
		$scope.model[$scope.entityName] = $scope.model[$scope.entityName] || {}; 
		$scope.model[$scope.entityName].list = response;
	}
	
	function edit(entity){
		var $scope = this;
		$scope.navigate($scope.entityName + '/edit/' + entity.id);
	}
	
	function remove(entity){
		var $scope = this;
		if (!confirm('remove?')) // TODO notifier
			return;
		
		$scope.dataservice.remove($scope.entityName, entity.id).then(_removed);
		function _removed(response){
			return removed($scope, response);
		}
	}
	
	function removed($scope){
		loadList($scope);
		alert('removed'); // TODO notifier
	}
	
	return dis;
}