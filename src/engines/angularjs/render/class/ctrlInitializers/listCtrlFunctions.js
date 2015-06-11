define(['src/render/renderService'],
	function (renderService) {
		var js = renderService.class.renderer;

		return { getFunctions: getFunctions };

		function getFunctions() {

			var baseCtrlInitializer = 'baseCtrlInitializer';
			var config = 'config';
			var $scope = '$scope';
			var dataservice = js.access($scope, 'dataservice');
			var model = js.access($scope, 'model');
			var entityName = 'entityName';
			var scopeEntityName = js.access($scope, entityName);
			var pathTokensElementAt0 = js.arrays.elementAt(js.access($scope, 'pathTokens'), 0);
			var response = 'response';
			var entity = 'entity';
			var entityId = js.access(entity, 'id');

			var listLoadedFn = {
				functionName: 'listLoaded',
				parameters: [$scope, response],
				body: getListLoadedFnBody()
			};
			var _listLoadedFn = {
				functionName: '_listLoaded',
				parameters: response,
				body: [js.functions.return(js.functions.execute(listLoadedFn.functionName, [$scope, response]))]
			};
			var loadListFn = {
				functionName: 'loadListFn',
				parameters: $scope,
				functions: [_listLoadedFn],
				body: getLoadListFnBody()
			};

			var editFn = {
				functionName: 'edit',
				parameters: entity,
				body: getEditFnBody()
			};

			var removedFn = {
				functionName: 'removed',
				parameters: $scope,
				body: getRemovedFnBody()
			};
			var _removedFn = {
				functionName: '_removed',
				parameters: response,
				body: [js.functions.return(js.functions.execute(removedFn.functionName, [$scope, response]))]
			};
			var removeFn = {
				functionName: 'remove',
				parameters: entity,
				functions: [_removedFn],
				body: getRemoveFnBody()
			};

			var initFn = {
				isPublic: true,
				_this: $scope,
				functionName: 'init',
				parameters: [$scope, config],
				body: getInitFnBody(),
				properties: [
					{ isPublic: true, propertyName: editFn.functionName, initialValue: editFn.functionName },
					{ isPublic: true, propertyName: removeFn.functionName, initialValue: removeFn.functionName }
				]
			};

			return [initFn, loadListFn, listLoadedFn, editFn, removeFn, removedFn];

			function getInitFnBody() {
				return [
					js.variables.defaultInitialization(config, js.constants.emptyObject),
					js.functions.execute(js.access(baseCtrlInitializer, 'init'), [$scope, config]),
					js.variables.assign(scopeEntityName, pathTokensElementAt0), // not in initFn.properties because it has to be between baseCtrlinitializer.init() and loadList()
					js.functions.execute(loadListFn.functionName, $scope),
				];
			}

			function getLoadListFnBody() {
				var executeGetAll = js.functions.execute(js.access(dataservice, 'getAll'), scopeEntityName);
				var executeGetAllThenFn = js.access(executeGetAll, 'then');
				return [
					js.functions.execute(executeGetAllThenFn, _listLoadedFn.functionName)
				];
			}

			function getListLoadedFnBody() {
				var entityModel = js.arrays.elementAt(model, scopeEntityName);
				var entityModelListProperty = js.access(entityModel, 'list');
				return [
					js.variables.defaultInitialization(entityModel, js.constants.emptyObject),
					js.variables.assign(entityModelListProperty, response)
				];
			}

			function getEditFnBody() {
				return [
					js.variables.declare($scope, js.constants._this),
					js.functions.execute(js.access($scope, 'navigate'), js.concatJs(scopeEntityName, ' + /edit/ + ', entityId))
				];
			}

			function getRemoveFnBody() {
				var executeRemove = js.functions.execute(js.access(dataservice, 'remove'), [scopeEntityName, entityId]);
				var executeRemoveThenFn = js.access(executeRemove, 'then');
				return [
					js.variables.declare($scope, js.constants._this),
					js.conditional.ifNotConfirm('remove?', js.functions.return()),
					js.functions.execute(executeRemoveThenFn, _removedFn.functionName)
				];
			}

			function getRemovedFnBody() {
				return [
					js.functions.execute(loadListFn.functionName, $scope),
					js.notifier.notify('removed')
				];
			}
		}
	});