define(['src/render/class/js/jsHelper', 'src/factories/class/js/jsInitializerFactory'],
	function (jsHelper, jsInitializerFactory) {
		var dis = {};
		dis.create = create;

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
			body: [jsHelper.functions.execute($location + '.path', 'to')]
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
				jsHelper.variables.defaultInitialization(config, jsHelper.constants.emptyObject),
				jsHelper.variables.defaultInitialization($scope + '.model', jsHelper.constants.emptyObject),
				jsHelper.variables.assign($scope + '.navigate', navigateToFn.functionName),
				jsHelper.variables.assign($scope + '.' + dataservice, dataservice),
				jsHelper.variables.assign($scope + '.pathTokens', jsHelper.functions.execute(getPathTokensFn.functionName).render())
			];
		}

		function getPathTokensFnBody() {
			var locationPathVar = jsHelper.variables.defaultValue($location + '.\$\$\$\$\$path', jsHelper.constants.emptyString).render();
			var splitPath = jsHelper.functions.execute(locationPathVar + '.split', "'/'").render();
			var filteredPath = jsHelper.functions.execute(splitPath + '.filter', jsHelper.functions.filters.getIfNotNot).render();
			return [jsHelper.return(filteredPath)];
		}

		return dis;
	});