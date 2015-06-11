define(['src/render/renderService'],
	function (renderService) {
		var js = renderService.class.renderer;

		return { getFunctions: getFunctions };

		function getFunctions() {

			var baseCtrlInitializer = 'baseCtrlInitializer';

			var $scope = '$scope';
			var config = 'config';
			var response = 'response';
			var pathTokens = js.access($scope, 'pathTokens');
			var dataservice = js.access($scope, 'dataservice');
			var model = js.access($scope, 'model');
			var entityName = js.access($scope, 'entityName');
			var entityId = js.access($scope, 'entityId');

			var setEntityDataFromPathFn = {
				functionName: 'setEntityDataFromPath',
				parameters: $scope,
				body: getSetEntityDataFromPathFnBody()
			};

			var _loadedEntityFn = {
				functionName: '_loadedEntity',
				parameters: response,
				body: getLoadedEntityFnBody()
			};

			var loadEntityFn = {
				functionName: 'loadEntity',
				parameters: $scope,
				functions: [_loadedEntityFn],
				body: getLoadEntityFnBody()
			};

			var savedFn = { functionName: 'saved', parameters: response, body: getSavedFnBody() };
			var saveFn = { functionName: 'save', body: getSaveFnBody() };

			var initFn = {
				isPublic: true,
				_this: $scope,
				functionName: 'init',
				parameters: [$scope, config],
				body: getInitFnBody(),				
				properties: [
					{ isPublic: true, propertyName: saveFn.functionName, initialValue: saveFn.functionName }
				]
			};
			
			return [initFn, setEntityDataFromPathFn, loadEntityFn, saveFn, savedFn];

			function getInitFnBody() {
				return [
					js.variables.defaultInitialization(config, js.constants.emptyObject),
					js.functions.execute(js.access(baseCtrlInitializer, 'init'), [$scope, config]),
					js.functions.execute(setEntityDataFromPathFn.functionName, $scope),
					js.functions.execute(loadEntityFn.functionName, $scope)
				];
			}

			function getSetEntityDataFromPathFnBody() {
				var pathTokens_0 = js.arrays.elementAt(pathTokens, 0);
				var pathTokens_2 = js.arrays.elementAt(pathTokens, 2);
				return [
					js.variables.assign(entityName, pathTokens_0),
					js.variables.assign(entityId, pathTokens_2)
				];
			}

			function getLoadedEntityFnBody() {
				return [js.variables.assign(model, response)];
			}

			function getLoadEntityFnBody() {
				var dataserviceGet = js.functions.execute(js.access(dataservice, 'get'), [entityName, entityId]);
				var dataserviceGetThenFn = js.access(dataserviceGet, 'then');
				return [
					js.conditional.if(js.compare.exactEquals(entityId, "'new'"), js.functions.return()),
					js.functions.execute(dataserviceGetThenFn, _loadedEntityFn.functionName)
				];
			}

			function getSaveFnBody() {
				var dataserviceSet = js.functions.execute(js.access(dataservice, 'set'), [entityName, model]);
				var dataserviceSetThenFn = js.access(dataserviceSet, 'then');
				return [
					js.variables.declare($scope, js.constants._this),
					js.functions.execute(dataserviceSetThenFn, savedFn.functionName)
				];
			}

			function getSavedFnBody() {
				return [js.notifier.notify('saved!')];
			}
		}
	});