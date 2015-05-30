function iudCtrlInitializer(baseCtrlInitializer, context) {
	var dis = {};
	dis.init = init;

	function init($scope, config) {
		config = config || {};
		baseCtrlInitializer.init($scope, config);

		$scope.canSave = canSave;
		$scope.save = save;

		$scope.entityName = $scope.pathTokens[0];
		var entityId = $scope.pathTokens[2];
		if (entityId !== 'new')
			$scope.dataservice.get($scope.entityName, entityId).then(loaded);

		function loaded(response) {
			$scope.model = response;
		}
	}

	function save() {
		if (!canSave()) {
			alert('you cannot save');
			return;
		}
		this.dataservice.set(this.entityName, this.model).then(saved);
	}

	function saved(response) {
		alert('saved!');
	}

	function canSave() {
		return true;
	}
	
	// TODO listCtrlInitializer
	
	return dis;
}