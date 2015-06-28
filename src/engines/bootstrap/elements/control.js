define(['src/code/html/htmlElements', 'src/code/html/htmlTransform'],
	function (htmlElements, htmlTransform) {
		var controlCssClasses = {
			groupDiv: 'form-group',
			firstControl: 'col-xs-3',
			secondControl: 'col-xs-9',
			label: 'control-label',
			input: 'form-control'
		};

		var dis = {};
		dis.process = processControl;

		function processControl(node) {
			if (isControlNode(node)) {
				var inputIndex = getInputIndex(node);
				var input = node[inputIndex];
				if (isNotExcludedInputType(node, inputIndex))
					htmlTransform.extendAttributes(input, { 'class': controlCssClasses.input });
				node[inputIndex] = htmlElements.node('div', [input]);

				var label = node[getLabelIndex(node)];
				htmlTransform.extendAttributes(label, { 'class': controlCssClasses.label });

				htmlTransform.extendAttributes(node, { 'class': controlCssClasses.groupDiv });
				htmlTransform.extendAttributes(node[2], { 'class': controlCssClasses.firstControl });
				htmlTransform.extendAttributes(node[3], { 'class': controlCssClasses.secondControl });
			}
			return node;
		}

		var inputTags = ['input', 'select', 'textarea'];
		var excludeInputTypes = ['checkbox'];
		function isControlNode(node) {
			return node.length > 2 && hasLabel(node) && isRightControlTag(node);
		}

		function hasLabel(node) {
			return (node[1].length > 0 && node[1][0] == 'label') ||
				(node[2].length > 0 && node[2][0] == 'label');
		}

		function isRightControlTag(node) {
			return (node[2].length > 0 && inputTags.indexOf(node[2][0]) >= 0) ||
				(node[1].length > 1 && inputTags.indexOf(node[1][0]) >= 0);
		}

		function isNotExcludedInputType(node, inputIndex) {
			for (var eit in excludeInputTypes) { // not [].forEach() because return
				if (node[inputIndex][1].type == excludeInputTypes[eit])
					return false;
			}
			return true;
		}

		function getInputIndex(node) { // multiple returns
			for (var it in inputTags) { // not [].forEach() because return
				var index = getIndex(inputTags[it], node);
				if (index >= 0)
					return index;
			}
			return -1;
		}

		function getLabelIndex(node) {
			return getIndex('label', node);
		}

		function getIndex(tag, node) { // multiple returns
			for (var n in node) { // not [].forEach() because return
				if (node[n][0] == tag)
					return n;
			}
			return -1;
		}

		return dis;
	});