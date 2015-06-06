define([], function () {
	var dis = {};
	dis.create = create;

	function create(jsConfig) {
		var functions = (jsConfig.functions || []);
		var functionName = jsConfig.functionName || '_foo';
		var dependencies = (jsConfig.dependencies || []);

		return {
			featureName: jsConfig.featureName || jsConfig.functionName,
			config: {
				functionName: functionName,
				dependencies: dependencies,
				functions: functions
			}
		};
	}

	return dis;
});