define(
	[
		'src/system/logger',
		'src/code/js/jsTransform',
		'src/engines/angularjs/aspects/logger/functions'
	],
	function (logger, jsTransform, functions) {
		var dis = {
			aspectName: 'angularjsLoggerJs',
			applyTo: applyTo,
			intercept: intercept
		};

		function applyTo(apzFile) {
			return apzFile.filePath.match(/\.js$/) && !apzFile.filePath.match(/logger\.js$/);
		}

		function intercept(node) {
			return jsTransform.nodeVisitor(node, [functions.process]);
		}

		return dis;
	});