define(
	[
		'src/render/renderService',
		'src/engines/angularjs/render/class/ctrlInitializers/iudCtrlFunctions'
	],
	function (renderService, iudCtrlFunctions) {
		var dis = {};
		var js = renderService.class.renderer;
		dis.render = render;

		var iudCtrlInitializer = 'iudCtrlInitializer';
		var baseCtrlInitializer = 'baseCtrlInitializer';

		var initializerConfig = {
			functionName: iudCtrlInitializer,
			dependencies: [baseCtrlInitializer],
			getFunctions: iudCtrlFunctions.getFunctions
		};

		function render(feature) {
			return js.class.renderClass(initializerConfig);
		}

		return dis;
	});