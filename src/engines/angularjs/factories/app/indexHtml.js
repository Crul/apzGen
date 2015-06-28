define(['src/system/utils', 'src/code/libResolver'],
	function (utils, libResolver) {
		var dis = {};
		dis.getModel = getHtmlModel;

		function getHtmlModel(app) {
			var files = getFilesToInclude(app);
			return {
				appName: app.featureName,
				title: app.featureName,
				cssLinks: getPaths('css', app.libs, files, libResolver.resolveCssFiles),
				jsScripts: getPaths('js', app.libs, files, libResolver.resolveJsFiles)
			};
		}

		var appFiles = [{ filePath: 'app.js' }];
		function getFilesToInclude(app) {
			var files = [];
			app.features.forEach(concatFeatureApzFiles);
			return files.concat(
				(app.angularjs.factories || []),
				(app.angularjs.controllers || []),
				appFiles);

			function concatFeatureApzFiles(feature) {
				files = files.concat(feature.apzFiles || []);
			}
		}


		function getPaths(fileExtension, libs, files, resolveFilesFn) {
			var includes = resolveFilesFn(libs).concat(files);
			includes = filterByExtension(includes, fileExtension);
			return utils.arrays.distinct(includes, compareFilePath);
		}

		function filterByExtension(array, fileExtension) {
			var fileExtensionPattern = '\.' + fileExtension + '$';
			return array.filter(utils.arrays.getRegexFilter(fileExtensionPattern));
		}

		function compareFilePath(a, b) {
			var filePathA = (a.filePath || a);
			var filePathB = (b.filePath || b);
			return filePathA == filePathB;
		}

		return dis;
	});