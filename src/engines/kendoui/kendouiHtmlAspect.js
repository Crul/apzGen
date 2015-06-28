define(['src/code/html/htmlTransform', 'src/engines/kendoui/elements/control'],
	function (htmlTransform, control) {
		var dis = {
			aspectName: 'kendouiHtml',
			applyTo: applyTo,
			intercept: intercept
		};

		function applyTo(apzFile) {
			return apzFile.filePath.match(/.html$/);
		}

		function intercept(code) {
			var processNodeFns = [control.process];
			htmlTransform.nodeVisitor(code, processNodeFns);
			return code;
		}

		return dis;
	});