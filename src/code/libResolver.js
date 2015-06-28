define(['src/system/utils'], function (utils) {
	var dis = {};
	dis.resolveCssFiles = resolveCssFiles;
	dis.resolveJsFiles = resolveJsFiles;

	var libVersions = {
		angularjs: '1.4.0-rc.2',
		bootstrap: '3.3.4',
		jquery: '2.1.4',
		kendoui: '2015.1.429'
	};

	var cdn = {
		angularjs: 'https://ajax.googleapis.com/ajax/libs/angularjs/' + libVersions.angularjs + '/',
		bootstrap: 'https://maxcdn.bootstrapcdn.com/bootstrap/' + libVersions.bootstrap + '/',
		jquery: 'http://code.jquery.com/jquery-' + libVersions.jquery + '.min.js',
		kendoui: 'http://cdn.kendostatic.com/' + libVersions.kendoui + '/'
	};

	function resolveCssFiles(libs) {
		return resolveLibFiles(libs, resolveCssLib);
	}

	function resolveJsFiles(libs) {
		return resolveLibFiles(libs, resolveJsLib);
	}

	function resolveLibFiles(libs, resolveLibFn) {
		var libFiles = [];
		libs.forEach(concatLibs);
		return libFiles;

		function concatLibs(lib) {
			var libPaths = utils.getArray(resolveLibFn(lib));
			var libFilesToAdd = libPaths.map(getFile);
			libFiles = libFiles.concat(libFilesToAdd);
		}
	}

	function getFile(libPath) {
		return { filePath: libPath };
	}

	function resolveCssLib(lib) { // multiple returns
		switch (lib.toLowerCase()) {
			case 'bootstrap':
				return cdn.bootstrap + 'css/bootstrap.min.css';
			case 'kendoui':
				return [
					//cdn.kendo + 'styles/kendo.common.min.css',
					//cdn.kendo + 'styles/kendo.default.min.css',
					cdn.kendoui + 'styles/kendo.common-bootstrap.min.css',
					cdn.kendoui + 'styles/kendo.bootstrap.min.css'
				];
			default:
				return lib;
		}
	}

	function resolveJsLib(lib) { // multiple returns
		switch (lib.toLowerCase()) {
			case 'jquery':
				return cdn.jquery;
			case 'angularjs':
				return cdn.angularjs + 'angular.min.js';
			case 'angularjs.route':
				return cdn.angularjs + 'angular-route.js';
			case 'bootstrap':
				return cdn.bootstrap + 'js/bootstrap.min.js';
			case 'kendoui':
				return cdn.kendoui + 'js/kendo.all.min.js';
			default:
				return lib;
		}
	}

	return dis;
});