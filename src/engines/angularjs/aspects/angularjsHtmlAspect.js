define(['src/code/htmlTransform'],
	function (htmlTransform) {
		var dis = {			
			aspectName: 'angularjsHtml',
			applyTo: applyTo,
			intercept: intercept
		};

		function applyTo(apzFile) {
			return apzFile.filePath.match(/.html$/);
		}

		function intercept(code) {
			htmlTransform.nodeVisitor(code, [processInput, processButton]);
			return code;
		}

		function processInput(node) {
			if (node[0] == 'input')
				htmlTransform.changeAttributeName(node, 'value', 'ng-model');
			return node;
		}

		function processButton(node) {
			if (node[0] == 'button')
				htmlTransform.changeAttributeName(node, 'click', 'ng-click');
			return node;
		}

		return dis;
	});