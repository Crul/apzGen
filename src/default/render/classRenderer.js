define(['src/system/utils'], function (utils) {
	var baseRenderer = 'src/render/class/js/jsRenderer';
	var pipeline = [
		'src/engines/angularjs/render/class/_default/ctrlRendererFactory'
		// notifier
		// logger
		// security
	];
	
	return utils.extendPipeline(baseRenderer, pipeline);	
});