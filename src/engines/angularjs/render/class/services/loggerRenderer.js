define(
	[
		'src/render/renderService',
		'src/engines/angularjs/render/class/services/loggerFunctions'
	],
	function (renderService, loggerFunctions) {
		var dis = {};
		var js = renderService.class.renderer;
		dis.render = render;

		function render(apzFile) {			
			var angularjsLogger = 'logger';
			var $delegate = '$delegate';
			var config = {
				functionName: angularjsLogger,
				dependencies: [$delegate],
				getFunctions: loggerFunctions.getFunctions,
				return: loggerFunctions.getReturn()
			};

			return js.class.renderClass(config);
		}


		return dis;
	});