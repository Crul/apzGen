define(
	[
		'src/render/renderService',
		'src/engines/angularjs/render/class/ctrlInitializers/listCtrlFunctions'
	],
	function (renderService, listCtrlFunctions) {
		var dis = {};
		var js = renderService.class.renderer;
		dis.render = render;

		var listCtrlInitializer = 'listCtrlInitializer';
		var baseCtrlInitializer = 'baseCtrlInitializer';
		var initializerConfig = {
			functionName: listCtrlInitializer,
			dependencies: [baseCtrlInitializer],
			getFunctions: listCtrlFunctions.getFunctions
		};

		function render(feature) {
			return js.class.renderClass(initializerConfig);
		}

		return dis;
	});