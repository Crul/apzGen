define(['src/default/render/classRenderer', 'src/factories/class/js/jsInitializerFactory'],
	function (classRenderer, jsInitializerFactory) {
		var dis = {};
		dis.create = create;

		var js = classRenderer;
		var dependentFeatures = {};
		dependentFeatures.baseCtrl = { featureType: 'ctrlInitializers/baseCtrl', featureName: 'baseCtrlInitializer' };

		var listCtrlInitializer = 'listCtrlInitializer';
		var baseCtrlInitializer = 'baseCtrlInitializer';
		var config = 'config';
		var $scope = '$scope';
		var dataservice = js.access($scope, 'dataservice');
		var model = js.access($scope, 'model');
		var entityName = js.access($scope, 'entityName');
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
			body: [js.return(js.functions.execute(listLoadedFn.functionName, [$scope, response]))]
		};

		var loadListFn = {
			functionName: 'loadListFn',
			parameters: $scope,
			body: getLoadListFnBody(),
			functions: [_listLoadedFn]
		};

		var editFn = {
			isPublic: true,
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
			body: [js.return(js.functions.execute(removedFn.functionName, [$scope, response]))]
		};

		var removeFn = {
			isPublic: true,
			functionName: 'remove',
			parameters: entity,
			body: getRemoveFnBody(),
			functions: [_removedFn]
		};

		var initFn = {
			parameters: [$scope, config],
			body: getInitFnBody()
		};

		var initializerConfig = {
			functionName: listCtrlInitializer,
			dependencies: [baseCtrlInitializer],
			initFn: initFn,
			functions: [loadListFn, listLoadedFn, editFn, removeFn, removedFn],
		};

		function create(definition) {
			var initializer = jsInitializerFactory.create(initializerConfig);
			var apzFiles = [{
				fileType: 'class',
				path: 'seedwork/controllers',
				fileName: listCtrlInitializer,
				renderer: definition.featureType
			}];

			initializer.dependentFeatures = dependentFeatures;
			initializer.apzFiles = apzFiles;
			initializer.angularjs = {
				factories: [listCtrlInitializer]
			};

			return initializer;
		}

		function getInitFnBody() {
			return [
				js.variables.defaultInitialization(config, js.constants.emptyObject),
				js.functions.execute(js.access(baseCtrlInitializer, 'init'), [$scope, config]),
				js.variables.assign(entityName, js.arrays.elementAt(js.access($scope, 'pathTokens'), 0)),
				js.variables.assign(js.access($scope, editFn.functionName), editFn.functionName),
				js.variables.assign(js.access($scope, removeFn.functionName), removeFn.functionName),
				js.functions.execute(loadListFn.functionName, $scope),
			];
		}

		function getLoadListFnBody() {
			var executeGetAll = js.functions.execute(js.access(dataservice, 'getAll'), entityName);
			var executeGetAllThenFn = js.access(executeGetAll, 'then');
			return [
				js.functions.execute(executeGetAllThenFn, _listLoadedFn.functionName)
			];
		}

		function getListLoadedFnBody() {
			var entityModel = js.arrays.elementAt(model, entityName);
			var entityModelListProperty = js.access(entityModel, 'list');
			return [
				js.variables.defaultInitialization(entityModel, js.constants.emptyObject),
				js.variables.assign(entityModelListProperty, response)
			];
		}

		function getEditFnBody() {
			return [
				js.variables.declare($scope, js.constants._this),
				js.functions.execute(js.access($scope, 'navigate'), js.concatJs(entityName, ' + /edit/ + ', entityId))
			];
		}

		function getRemoveFnBody() {
			var executeRemove = js.functions.execute(js.access(dataservice, 'remove'), [entityName, entityId]);
			var executeRemoveThenFn = js.access(executeRemove, 'then');
			return [
				js.variables.declare($scope, js.constants._this),
				js.conditional.ifNotConfirm('remove?', js.return()),
				js.functions.execute(executeRemoveThenFn, _removedFn.functionName)
			];
		}

		function getRemovedFnBody() {
			return [
				js.functions.execute(loadListFn.functionName, $scope),
				js.notifier.notify('removed')
			];
		}

		return dis;
	});