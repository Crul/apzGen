function baseCtrlInitializer($location, dataservice, $log) {
	var dis = {};
	dis.init = init;
	function init($scope, config) {
		config = (config || {});
		$scope.model = ($scope.model || {});
		$scope.navigate = navigateTo;
		$scope.dataservice = dataservice;
		$scope.pathTokens = getPathTokens();
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