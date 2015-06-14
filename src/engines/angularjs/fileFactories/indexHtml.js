define(
	[
		'src/system/utils',
		'src/code/htmlElements',
		'src/code/htmlLibResolver'
	],
	function (utils, htmlElements, htmlLibResolver) {
		var dis = {};
		dis.create = create;

		function create() {
			return { filePath: 'index.html', getDefinition: getDefinition };
		}

		function getDefinition(app) {
			var appName = app.featureName;
			var files = getFiles(app);
			var htmlPageDefinition = {
				head: getHead(appName, app, files),
				body: getBody(appName, app, files),
				htmlAttributes: { 'ng-app': appName }
			};
			return htmlElements.htmlPage(htmlPageDefinition);
		}

		function getFiles(app) {
			var files = [];
			app.features.forEach(concatFeatureApzFiles);

			files = files.concat(app.angularjs.factories || []);
			files = files.concat(app.angularjs.controllers || []);
			return files.concat(app.apzFiles || []);

			function concatFeatureApzFiles(feature) {
				files = files.concat(feature.apzFiles || []);
			}
		}

		function getHead(appName, app, files) {
			var includes = createCssIncludes(app.libs, files);
			return [htmlElements.node('title', appName || 'apzGen')].concat(includes);
		}

		function getBody(appName, app, files) {
			var title = app.title || appName || 'angularjsApp';
			var h1 = htmlElements.node('h1', title);
			var viewDiv = htmlElements.node('div', '', { 'ng-view': '' });
			var includes = createJsIncludes(app.libs, files);

			return [h1, viewDiv].concat(includes);
		}

		function createCssIncludes(libs, files) {
			return createIncludes('css', libs, files, htmlLibResolver.resolveCssFiles, htmlElements.cssInclude);
		}

		function createJsIncludes(libs, files) {
			return createIncludes('js', libs, files, htmlLibResolver.resolveJsFiles, htmlElements.jsInclude);
		}

		function createIncludes(fileExtension, libs, files, resolveFilesFn, createNodeFn) {
			var includes = resolveFilesFn(libs).concat(files);
			includes = utils.arrays.distinct(includes, compareFilePath);
			var jsIncludes = includes.filter(getFilterByExtension(fileExtension));
			return jsIncludes.map(createNodeFn);
		}

		function compareFilePath(a, b) {
			var filePathA = (a.filePath || a);
			var filePathB = (b.filePath || b);
			return filePathA == filePathB;
		}

		function getFilterByExtension(extension) {
			var pattern = new RegExp('.' + extension + '$');
			return filterByExtesion;

			function filterByExtesion(file) {
				return (file.filePath || file).match(pattern);
			}
		}

		return dis;
	});