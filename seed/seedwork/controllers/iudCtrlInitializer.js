function iudCtrlInitializer(baseCtrlInitializer) {
	var dis = {};
	dis.init = init;
	function init($scope, config) {
		config = (config || {});
		baseCtrlInitializer.init($scope, config);
		setEntityDataFromPath($scope);
		loadEntity($scope);
		$scope.save = save;
	}
	function setEntityDataFromPath($scope) {
		$scope.entityName = $scope.pathTokens[0];
		$scope.entityId = $scope.pathTokens[2];
	}
	function loadEntity($scope) {
		if ($scope.entityId === 'new') {
			return;
		}
		$scope.dataservice.get($scope.entityName, $scope.entityId).then(_loadedEntity);
		function _loadedEntity(response) {
			$scope.model = response;
		}
	}
	function save() {
		var $scope = this;
		$scope.dataservice.set($scope.entityName, $scope.model).then(saved);
	}
	function saved(response) {
		alert('saved!');
	}
	return dis;
}