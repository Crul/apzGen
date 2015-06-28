define(
	[
		'src/code/html/htmlTransform',
		'src/engines/angularjs/aspects/html/button',
		'src/engines/angularjs/aspects/html/input'
	],
	function (htmlTransform, button, input) {
		var dis = {
			aspectName: 'angularjsHtml',
			applyTo: applyTo,
			intercept: intercept
		};

		function applyTo(apzFile) {
			return apzFile.filePath.match(/.html$/);
		}

		function intercept(code) {
			htmlTransform.nodeVisitor(code, [input.process, button.process]);
			return code;
		}

		return dis;
	});