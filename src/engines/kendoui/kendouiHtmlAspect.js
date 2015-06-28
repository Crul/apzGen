define(['src/code/html/htmlTransform'],
	function (htmlTransform) {
		var numericInputAttribute = 'kendo-numeric-text-box';
		var bootstrapCssClassToRemoveInNumeric = 'form-control';
		
		var dis = {
			aspectName: 'kendouiHtml',
			applyTo: applyTo,
			intercept: intercept
		};

		function applyTo(apzFile) {
			return apzFile.filePath.match(/.html$/);
		}

		function intercept(code) {
			var processNodeFns = [processInput];
			htmlTransform.nodeVisitor(code, processNodeFns);
			return code;
		}

		function processInput(node) {
			if (node[0] == 'input') {
				node = processInputAttributes(node);
			}
			return node;
		}

		function processInputAttributes(node) {
			if (node.length < 2)
				node.push({});

			switch (node[1].type) {
				case 'numeric':
					node[1][numericInputAttribute] = '';
					if (node[1].class)
						node[1].class = node[1].class.replace(bootstrapCssClassToRemoveInNumeric, '').replace(/  /g, ' ');
					break;
			}

			return node;
		}

		return dis;
	});