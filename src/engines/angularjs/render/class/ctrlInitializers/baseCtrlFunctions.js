define(['src/render/renderService'],
	function (renderService) {
		var js = renderService.class.renderer;

		return { getFunctions: getFunctions };

		function getFunctions() {

			var $scope = '$scope';
			var config = 'config';
			var $location = '$location';
			var dataservice = 'dataservice';

			var navigateToFn = { functionName: 'navigateTo', parameters: 'to', body: getNavigateToFnBody() };
			var getPathTokensFn = { functionName: 'getPathTokens', body: getPathTokensFnBody() };
			var initFn = {
				isPublic: true,
				_this: $scope,
				functionName: 'init',
				parameters: [$scope, config],
				body: getInitFnBody(),
				properties: [
					{ isPublic: true, propertyName: 'navigate', initialValue: navigateToFn.functionName },
					{ isPublic: true, propertyName: dataservice, initialValue: dataservice },
					{ isPublic: true, propertyName: 'pathTokens', initialValue: js.functions.execute(getPathTokensFn.functionName) },
				]
			};

			return [initFn, navigateToFn, getPathTokensFn];

			function getNavigateToFnBody() {
				return [js.functions.execute(js.access($location, 'path'), 'to')];
			}

			function getInitFnBody() {
				return [
					js.variables.defaultInitialization(config, js.constants.emptyObject),
					js.variables.defaultInitialization(js.access($scope, 'model'), js.constants.emptyObject),
				];
			}

			function getPathTokensFnBody() {
				var locationPathVar = js.variables.defaultValue(js.access($location, '\$\$\$\$\$path'), js.constants.emptyString);

				var splitPathFn = js.access(locationPathVar, 'split');
				var executeSplitPath = js.functions.execute(splitPathFn, "'/'");

				var filterPathFn = js.access(executeSplitPath, 'filter');
				var executeFilterPath = js.functions.execute(filterPathFn, js.functions.filters.getIfNotNot);

				return [js.functions.return(executeFilterPath)];
			}
		}
	});