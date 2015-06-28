define(['src/system/utils', 'src/code/js/jsElements'],
	function (utils, jsElements) {
		var dis = {};
		dis.nodeVisitor = nodeVisitor;
		dis.addParamToFunction = addParamToFunction;

		function nodeVisitor(node, processNodeFns) {
			switch (node.type) {
				case 'Program':
					node.body = (node.body || []).map(nodeElementVisitor);
					break;
				case 'FunctionDeclaration':
				case 'FunctionExpression':
					node.body.body = (node.body.body || []).map(nodeElementVisitor);
					break;
				// TODO complete js nodeVisitor
			}

			processNodeFns = utils.getArray(processNodeFns);
			processNodeFns.forEach(processNode);
			return node;

			function processNode(processNodeFn) {
				node = processNodeFn(node);
			}

			function nodeElementVisitor(element) {
				element._parent = node;
				return nodeVisitor(element, processNodeFns);
			}
		}

		function addParamToFunction(node, newParam) {
			var paramAlreadyAdded = ((node.params || []).filter(compareWithNewParam).length > 0);
			if (!paramAlreadyAdded)
				node.params.push(jsElements.createIdentifier(newParam));

			function compareWithNewParam(param) {
				return param.name == newParam;
			}
		}


		return dis;
	});