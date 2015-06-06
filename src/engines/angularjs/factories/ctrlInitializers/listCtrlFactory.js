define(
	[
		'src/render/class/js/jsHelper',
		'src/factories/class/js/jsInitializerFactory'
	],
	function (jsHelper, jsInitializerFactory) {
		var dis = {};
		dis.create = create;

		var dependentFeatures = {};
		dependentFeatures.baseCtrl = { featureType: 'ctrlInitializers/baseCtrl', featureName: 'baseCtrlInitializer' };

		var listCtrlInitializer = 'listCtrlInitializer';
		var baseCtrlInitializer = 'baseCtrlInitializer';
		var config = 'config';
		var $scope = '$scope';
		var entityName = $scope + '.entityName';
		var model = $scope + '.model';
		var response = 'response';
		var entity = 'entity';
		var entityId = entity + '.id';

		var listLoadedFn = {
			functionName: 'listLoaded',
			parameters: [$scope, response],
			body: getListLoadedFnBody()
		};

		var _listLoadedFn = {
			functionName: '_listLoaded',
			parameters: response,
			body: [jsHelper.return(jsHelper.functions.execute(listLoadedFn.functionName, [$scope, response]).render())]
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
			body: [jsHelper.return(jsHelper.functions.execute(removedFn.functionName, [$scope, response]).render())]
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
				jsHelper.variables.defaultInitialization(config, jsHelper.constants.emptyObject),
				jsHelper.functions.execute(baseCtrlInitializer + '.init', [$scope, config]),
				jsHelper.variables.assign(entityName, jsHelper.arrays.elementAt($scope + '.pathTokens', 0).render()),
				jsHelper.variables.assign($scope + '.' + editFn.functionName, editFn.functionName),
				jsHelper.variables.assign($scope + '.' + removeFn.functionName, removeFn.functionName),
				jsHelper.functions.execute(loadListFn.functionName, $scope),
			];
		}

		function getLoadListFnBody() {
			var getAll = jsHelper.functions.execute($scope + '.dataservice.getAll', entityName).render();
			return [
				jsHelper.functions.execute(getAll + '.then', _listLoadedFn.functionName)
			];
		}

		function getListLoadedFnBody() {
			var entityModel = jsHelper.arrays.elementAt(model, entityName).render();
			return [
				jsHelper.variables.defaultInitialization(entityModel, jsHelper.constants.emptyObject),
				jsHelper.variables.assign(entityModel + '.list', response)
			];
		}

		function getEditFnBody() {
			return [
				jsHelper.variables.declare($scope, jsHelper.constants._this),
				jsHelper.functions.execute($scope + '.navigate', entityName + " + /edit/ + " + entityId)
			];
		}

		function getRemoveFnBody() {
			var remove = jsHelper.functions.execute($scope + '.dataservice.remove', [entityName, entityId]).render();
			return [
				jsHelper.variables.declare($scope, jsHelper.constants._this),
				jsHelper.ifNotConfirm('remove?', jsHelper.return()),
				jsHelper.functions.execute(remove + '.then', _removedFn.functionName)
			];
		}

		function getRemovedFnBody() {
			return [
				jsHelper.functions.execute(loadListFn.functionName, $scope),
				jsHelper.notifier.notify('removed')
			];
		}

		return dis;
	});