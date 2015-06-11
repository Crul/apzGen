define(['src/render/renderService'],
	function (renderService) {
		var js = renderService.class.renderer;

		var $log = '$log';
		var logger = 'logger';
		var logFn = 'log';

		return { create: create };

		function create(viewRenderer) {
			var util = require('util');
			var renderClassBaseFn = viewRenderer.class.renderClass;
			var declareFunctionBaseFn = viewRenderer.functions.declare;
			var dis = util._extend({}, viewRenderer);

			dis.functions.declare = declareFunction;
			dis.class.renderClass = renderClass;

			function renderClass(classConfig) {
				if (classConfig.functionName !== logger)
					addLogDependency(classConfig);

				return renderClassBaseFn(classConfig);
			}

			function declareFunction(fnConfig) {
				fnConfig = fnConfig || {};
				fnConfig.body = fnConfig.body || []; // TODO wrap in utils and search for more Array.isArray
				if (!Array.isArray(fnConfig.body))
					fnConfig.body = [fnConfig.body];

				addLogExecution(fnConfig);
				return declareFunctionBaseFn(fnConfig);
			}

			function addLogDependency(fnConfig) {
				if (Array.isArray(fnConfig.dependencies)) {
					addLogIfNotExists(fnConfig.dependencies);
				} else {
					fnConfig.parameters = (fnConfig.parameters || []);
					addLogIfNotExists(fnConfig.parameters);
					if (fnConfig.parameters.indexOf($log) < 0)
						fnConfig.parameters.push($log);
				}
			}

			function addLogIfNotExists(array) {
				if (array.indexOf($log) < 0)
					array.push($log);
			}

			function addLogExecution(fnConfig) {
				var fnScope = (fnConfig.parameters || [])
					.concat(fnConfig.dependencies || [])
					.concat(fnConfig.context || []);

				if (fnScope.indexOf($log) >= 0) {
					fnConfig.body = getLogExecution(fnConfig).concat(fnConfig.body);
				}
			}

			function getLogExecution(fnConfig) {
				var message = 'executing ' + fnConfig.functionName + 
				' args: ';
				var jsMessage = js.strings.value(message).render() + ' + Array.prototype.slice.call(arguments)';
				return [js.functions.execute(js.access($log, logFn), js.strings.value('executing ' + fnConfig.functionName)),
					js.functions.execute(js.access($log, logFn), jsMessage)];
			}

			return dis;
		}
	});