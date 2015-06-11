define(
	[
		'src/system/utils',
		'src/render/renderService'
	],
	function (utils, renderService) {
		var dis = {};
		dis.getThirdPartyLibs = getThirdPartyLibs;
		dis.getApzFiles = getApzFiles;
		dis.initElements = initElements;
		dis.setRenderPipeline = setRenderPipeline;

		var rendererFactoriesPath = {
			class: ['src/engines/angularjs/render/factories/ctrlRendererFactory'],
			view: ['src/engines/angularjs/render/factories/htmlRendererFactory']
		};

		function getThirdPartyLibs(app, requiredLibs) {
			var libs = requiredLibs.concat(initElements('libs', app));
			return utils.arrays.distinct(libs);
		}

		function getApzFiles(app, extraFiles) {
			var apzFiles = (app.apzFiles || []).concat(extraFiles);
			return utils.arrays.distinct(apzFiles);
		}

		function initElements(propertyPath, app) {
			var elements = utils.getPropertyValue(app, propertyPath) || [];
			app.features.forEach(concatElements);

			return utils.arrays.distinct(elements);

			function concatElements(feature) {
				var featurePropertyValue = utils.getPropertyValue(feature, propertyPath) || [];
				if (Array.isArray(featurePropertyValue)) {
					elements = elements.concat(featurePropertyValue);
				}
			}
		}

		function setRenderPipeline(renderPipeline) {
			addPipeline(renderService.view, rendererFactoriesPath.view, renderPipeline.view);
			addPipeline(renderService.class, rendererFactoriesPath.class, renderPipeline.class);
		}

		function addPipeline(pipeline, baseRenderers, rendererFactoriesPaths) {
			var renderersToAdd = baseRenderers.concat(rendererFactoriesPaths || []);
			// TODO log pipeline
			renderersToAdd = utils.arrays.distinct(renderersToAdd);
			renderersToAdd.map(require).forEach(pipeline.addRenderer);
		}

		return dis;
	});