define(
	[
		'src/code/html/htmlTransform',
		'src/engines/bootstrap/elements/body',
		'src/engines/bootstrap/elements/button',
		'src/engines/bootstrap/elements/control',
		'src/engines/bootstrap/elements/form',
		'src/engines/bootstrap/elements/table',
		'src/engines/bootstrap/elements/unorderedList'
	],
	function (htmlTransform, body, button, control, form, table, unorderedList) {
		var dis = {
			aspectName: 'boostrapHtml',
			applyTo: applyTo,
			intercept: intercept
		};

		function applyTo(apzFile) {
			return apzFile.filePath.match(/.html$/);
		}

		function intercept(code) {
			var processNodeFns = [
				body.process,
				table.process,
				form.process,
				control.process,
				button.process,
				unorderedList.process
			];
			code = htmlTransform.nodeVisitor(code, processNodeFns);
			return code;
		}

		return dis;
	});