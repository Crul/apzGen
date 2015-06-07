define(['src/system/utils'], function (utils) {
	var baseRenderer = 'src/render/view/html/htmlRenderer';
	var pipeline = [
		'src/engines/angularjs/render/view/htmlRendererFactory',
		'src/engines/angularjs/render/view/kendouiRendererFactory',
		'src/render/view/bootstrap/bootstrapRendererFactory'
	];

	return utils.extendPipeline(baseRenderer, pipeline);
});