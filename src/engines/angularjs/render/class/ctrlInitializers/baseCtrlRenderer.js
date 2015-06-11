define(
	[
		'src/render/renderService',
		'src/engines/angularjs/render/class/ctrlInitializers/baseCtrlFunctions'
	],
	function (renderService, baseCtrlFunctions) {
		var dis = {};
		var js = renderService.class.renderer;
		dis.render = render;

		var baseCtrlInitializer = 'baseCtrlInitializer';
		var $location = '$location';
		var dataservice = 'dataservice';

		var initializerConfig = {
			functionName: baseCtrlInitializer,
			dependencies: [$location, dataservice],
			getFunctions: baseCtrlFunctions.getFunctions
		};

		function render(feature) {
			return js.class.renderClass(initializerConfig);
		}

		return dis;
	});