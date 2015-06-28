function listCtrlInitializer(baseCtrlInitializer) {
	var dis = {};
	dis.init = init;

	function init($scope, config) {
		return baseCtrlInitializer.init($scope, config).then(initList);

		function initList() {
			$scope.entityName = $scope.pathTokens[0];
			loadListFn($scope);
			$scope.edit = edit;
			$scope.remove = remove;
		}
	}

	function loadListFn($scope) {
		$scope.dataservice.getAll($scope.entityName).then(_listLoaded);
		function _listLoaded(response) {
			return listLoaded($scope, response);
		}
	}

	function listLoaded($scope, response) {
		$scope.model[$scope.entityName] = ($scope.model[$scope.entityName] || {});
		$scope.model[$scope.entityName].list = response;
	}

	function edit(entity) {
		var $scope = this;
		$scope.navigate($scope.entityName + /edit/ + entity.id);
	}

	function remove(entity) {
		var $scope = this;
		if (!confirm('remove?')) {
			return;
		}
		$scope.dataservice.remove($scope.entityName, entity.id).then(_removed);
		function _removed(response) {
			return removed($scope, response);
		}
	}

	function removed($scope) {
		loadListFn($scope);
		alert('removed');
	}

	return dis;
}