define(['src/default/render/classRenderer', 'src/factories/class/js/jsInitializerFactory'],
	function (classRenderer, jsInitializerFactory) {
		var dis = {};
		dis.create = create;

		var js = classRenderer;
		var dependentFeatures = {
			dataservice: { featureType: 'dataservices/localStorage', featureName: 'dataservice' }
		};

		var baseCtrlInitializer = 'baseCtrlInitializer';
		var $scope = '$scope';
		var config = 'config';
		var $location = '$location';
		var dataservice = 'dataservice';

		var navigateToFn = {
			functionName: 'navigateTo',
			parameters: 'to',
			body: [js.functions.execute(js.access($location, 'path'), 'to')]
		};

		var getPathTokensFn = {
			functionName: 'getPathTokens',
			body: getPathTokensFnBody()
		};

		var initFn = {
			parameters: [$scope, config],
			body: getInitFnBody()
		};

		var initializerConfig = {
			functionName: baseCtrlInitializer,
			dependencies: [$location, dataservice],
			initFn: initFn,
			functions: [navigateToFn, getPathTokensFn]
		};

		function create(definition) {
			var initializer = jsInitializerFactory.create(initializerConfig);
			var apzFiles = [{
				fileType: 'class',
				path: 'seedwork/controllers',
				fileName: baseCtrlInitializer,
				renderer: definition.featureType
			}];

			initializer.dependentFeatures = dependentFeatures;
			initializer.apzFiles = apzFiles;
			initializer.angularjs = {
				factories: ['seedwork/controllers/' + baseCtrlInitializer + '.js']
			};

			return initializer;
		}

		function getInitFnBody() {
			return [
				js.variables.defaultInitialization(config, js.constants.emptyObject),
				js.variables.defaultInitialization(js.access($scope, 'model'), js.constants.emptyObject),
				js.variables.assign(js.access($scope, 'navigate'), navigateToFn.functionName),
				js.variables.assign(js.access($scope, dataservice), dataservice),
				js.variables.assign(js.access($scope, 'pathTokens'), js.functions.execute(getPathTokensFn.functionName))
			];
		}

		function getPathTokensFnBody() {
			var locationPathVar = js.variables.defaultValue(js.access($location, '\$\$\$\$\$path'), js.constants.emptyString);

			var splitPathFn = js.access(locationPathVar, 'split');
			var executeSplitPath = js.functions.execute(splitPathFn, "'/'");

			var filterPathFn = js.access(executeSplitPath, 'filter');
			var executeFilterPath = js.functions.execute(filterPathFn, js.functions.filters.getIfNotNot);

			return [js.return(executeFilterPath)];
		}

		return dis;
	});