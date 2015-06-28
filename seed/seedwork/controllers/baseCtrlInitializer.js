function baseCtrlInitializer($q, $location, dataservice) {
	var dis = {};
	dis.init = init;

	function init($scope, config) {
		var deferred = $q.defer();
		config = (config || {});
		$scope.data = ($scope.data || {});
		$scope.model = ($scope.model || {});
		$scope.navigate = navigateTo;
		$scope.dataservice = dataservice;
		$scope.pathTokens = getPathTokens();
		preloadData($scope, deferred, config.preload);
		return deferred.promise;
	}

	function preloadData($scope, deferred, preloadConfig) {
		if (!preloadConfig) {
			deferred.resolve();
		} else {
			var preloadPromises = preloadConfig.map(preloadDataElement);
			$q.all(preloadPromises).then(deferred.resolve);
		}

		function preloadDataElement(preloadElement) {
			return dataservice.getAll(preloadElement).then(dataElementPreloaded);
			function dataElementPreloaded(entityList) {
				$scope.data[preloadElement] = $scope.data[preloadElement] || {};
				$scope.data[preloadElement].list = entityList;
			}
		}
	}

	function navigateTo(to) {
		$location.path(to);
	}

	function getPathTokens() {
		return ($location.$$path || '').split('/').filter(function (_e) {
			return !!_e;
		});
	}

	return dis;
}