define(
	[
		'src/render/renderService',
		'src/engines/angularjs/render/class/dataservices/localStorageFunctions'
	],
	function (renderService, localStorageFunctions) {
		var dis = {};
		var js = renderService.class.renderer;
		dis.render = render;
		
		var dataservice = 'dataservice';
		var $q = '$q';
		var localStorageService = 'localStorageService';
		
		var config = {
			functionName: dataservice,
			dependencies: [$q, localStorageService],
			getFunctions: localStorageFunctions.getFunctions
		};

		function render(definition) {
			return js.class.renderClass(config);
		}
		
		return dis;
	});