define([], function () {
	var dis = {};
	dis.resolveCssFiles = resolveCssFiles;
	dis.resolveJsFiles = resolveJsFiles;

	var cdn = {
		angular: 'https://ajax.googleapis.com/ajax/libs/angularjs/1.4.0-rc.2/',
		bootstrap: 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/',
		jquery: 'http://code.jquery.com/jquery-2.1.4.min.js'
	};

	function resolveCssFiles(libs) {
		return resolveLibFiles(libs, resolveCssLib);
	}

	function resolveJsFiles(libs) {
		return resolveLibFiles(libs, resolveJsLib);
	}

	function resolveLibFiles(libs, resolveLibFn) {
		var libFiles = [];
		for (var l in libs) {
			var libFile = resolveLibFn(libs[l]);
			if (libFile) libFiles.push({ fileName: libFile });
		}
		return libFiles;
	}

	function resolveCssLib(lib) {
		switch (lib.toLowerCase()) {
			case 'bootstrap':
				return cdn.bootstrap + 'css/bootstrap.min.css';
			case 'kendo':
				return ''; // TODO kendo css cdn ¿kendo-bootstrap?
			default:
				return lib;
		}
	}

	function resolveJsLib(lib) {
		switch (lib.toLowerCase()) {
			case 'jquery':
				return cdn.jquery;
			case 'angularjs':
				return cdn.angular + 'angular.min.js';
			case 'angularjs.route':
				return cdn.angular + 'angular-route.js';
			case 'bootstrap':
				return cdn.bootstrap + 'js/bootstrap.min.js';
			case 'kendo':
				return ''; // TODO kendo js 
			default:
				return lib;
		}
	}

	return dis;
});