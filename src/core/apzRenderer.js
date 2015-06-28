define(['src/system/logger', 'src/core/apzContext', 'src/core/apzAspectPipeline', 'src/core/apzFileRenderer'],
	function (logger, apzContext, apzAspectPipeline, apzFileRenderer) {
		var dis = {};
		dis.render = render;

		function render(apz) {
			logger.log('rendering apz ...');
			apzContext.isRendering = true;
			var aspects = apzAspectPipeline.get();
			var renderedFiles = getApzFiles(apz).map(renderApzFile);
			apzContext.isRendering = false;
			return renderedFiles;

			function renderApzFile(apzFile) {
				return apzFileRenderer.render(apzFile, apz, aspects);
			}
		}

		function getApzFiles(apz) {
			var apzFiles = apz.getApzFiles(apz).slice(0);
			apz.apzFiles = apzFiles;
			apzFiles.forEach(setApzFeature);
			apz.features.forEach(concatFeatureApzFiles);
			return apzFiles;

			function concatFeatureApzFiles(feature) {
				if (!feature.getApzFiles) {
					logger.trace('feature with no apzFiles skipped: ' + feature.featureName);
					return;
				}
				var featureFiles = (feature.getApzFiles(feature, apz) || []).slice(0);
				feature.apzFiles = featureFiles;
				featureFiles.forEach(setFeature);
				apzFiles = apzFiles.concat(featureFiles);

				function setFeature(apzFile) {
					apzFile.feature = feature;
				}
			}

			function setApzFeature(apzFile) {
				apzFile.feature = apz;
			}
		}

		return dis;
	});