define(['src/code/jsElements'], function (jsElements) {
	var dis = {};
	dis.create = create;

	function create(feature) {
		var featureName = feature.featureName || 'list';
		var filePath = featureName + '/' + featureName + '.js';
		return {
			filePath: filePath,
			getDefinition: getDefinition
		};

		function getDefinition() {
			var $scope = '$scope';
			var baseCtrlInitializer = 'iudCtrlInitializer';
			var dependencies = [$scope, baseCtrlInitializer];
			var body = jsElements.callFunction(baseCtrlInitializer, 'init', jsElements.identifier($scope));
			var fn = jsElements.functionDeclaration(featureName, body, dependencies);
			return jsElements.program(fn);
		}
	}

	return dis;
});