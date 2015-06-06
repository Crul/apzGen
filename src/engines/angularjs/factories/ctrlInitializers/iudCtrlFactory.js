define(['src/render/class/js/jsHelper', 'src/factories/class/js/jsInitializerFactory'],
	function (jsHelper, jsInitializerFactory) {
		var dis = {};
		dis.create = create;

		var dependentFeatures = {};
		dependentFeatures.baseCtrl = { featureType: 'ctrlInitializers/baseCtrl', featureName: 'baseCtrlInitializer' };

		var iudCtrlInitializer = 'iudCtrlInitializer';
		var baseCtrlInitializer = 'baseCtrlInitializer';
		var $scope = '$scope';
		var config = 'config';
		var response = 'response';
		var pathTokens = $scope + '.pathTokens';
		var dataservice = $scope + '.' + 'dataservice';
		var model = $scope + '.model';
		var entityName = $scope + '.entityName';
		var entityId = $scope + '.entityId';

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
			body: getLoadEntityFnBody(),
			functions: [_loadedEntityFn]
		};

		var savedFn = {
			functionName: 'saved',
			parameters: response,
			body: getSavedFnBody()
		};

		var saveFn = {
			functionName: 'save',
			body: getSaveFnBody()
		};

		var initFn = {
			parameters: [$scope, config],
			body: getInitFnBody()
		};

		var initializerConfig = {
			functionName: iudCtrlInitializer,
			dependencies: [baseCtrlInitializer],
			initFn: initFn,
			functions: [setEntityDataFromPathFn, loadEntityFn, saveFn, savedFn]
		};

		function create(definition) {
			var initializer = jsInitializerFactory.create(initializerConfig);
			var apzFiles = [{
				fileType: 'class',
				path: 'seedwork/controllers',
				fileName: iudCtrlInitializer,
				renderer: definition.featureType
			}];

			initializer.dependentFeatures = dependentFeatures;
			initializer.apzFiles = apzFiles;
			initializer.angularjs = {
				factories: ['seedwork/controllers/' + iudCtrlInitializer + '.js']
			};

			return initializer;
		}

		function getInitFnBody() {
			return [
				jsHelper.variables.defaultInitialization(config, jsHelper.constants.emptyObject),
				jsHelper.variables.assign($scope + '.' + saveFn.functionName, saveFn.functionName),
				jsHelper.functions.execute(baseCtrlInitializer + '.init', [$scope, config]),
				jsHelper.functions.execute(setEntityDataFromPathFn.functionName, $scope),
				jsHelper.functions.execute(loadEntityFn.functionName, $scope)
			];
		}

		function getSetEntityDataFromPathFnBody() {
			var pathTokens_0 = jsHelper.arrays.elementAt(pathTokens, 0);
			var pathTokens_2 = jsHelper.arrays.elementAt(pathTokens, 2);
			return [
				jsHelper.variables.assign(entityName, pathTokens_0),
				jsHelper.variables.assign(entityId, pathTokens_2)
			];
		}

		function getLoadedEntityFnBody() {
			return [jsHelper.variables.assign(model, response)];
		}

		function getLoadEntityFnBody() {
			var dataserviceGet = jsHelper.functions.execute(dataservice + '.get', [entityName, entityId]);
			var dataserviceGetThenFn = jsHelper.access(dataserviceGet, 'then');
			return [
				jsHelper.conditional.if(jsHelper.compare.exactEquals(entityId, "'new'"), jsHelper.return()),
				jsHelper.functions.execute(dataserviceGetThenFn, _loadedEntityFn.functionName)
			];
		}

		function getSaveFnBody() {
			var dataserviceSet = jsHelper.functions.execute(dataservice + '.set', [entityName, model]);
			var dataserviceSetThenFn = jsHelper.access(dataserviceSet, 'then');			
			return [
				jsHelper.variables.declare($scope, jsHelper.constants._this),
				jsHelper.functions.execute(dataserviceSetThenFn, savedFn.functionName)
			];
		}

		function getSavedFnBody() {
			return [jsHelper.notifier.notify('saved!')];
		}

		return dis;
	});