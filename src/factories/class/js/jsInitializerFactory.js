define(['src/factories/class/js/jsFactory'],
	function (jsFactory) {
		var dis = {};
		dis.create = create;

		function create(initializerConfig) {
			var initFn = getInitFn(initializerConfig);
			initializerConfig.functions = [initFn].concat(initializerConfig.functions || []);
			initializerConfig.functionName = initializerConfig.functionName || 'initializer';
			initializerConfig.dependencies = (initializerConfig.dependencies || ['config']);

			return jsFactory.create(initializerConfig);
		}

		function getInitFn(initializerConfig) {
			var initFn = initializerConfig.initFn;
			if (initFn.isPublic === undefined)
				initFn.isPublic = true;

			initFn.functionName = initFn.functionName || 'init';
			return initFn;
		}

		return dis;
	});