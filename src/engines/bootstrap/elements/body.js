define(['src/code/html/htmlTransform'],
	function (htmlTransform) {
		var bodyCssClass = 'container';
		var dis = {};
		dis.process = processBody;

		function processBody(node) {
			if (node[0] == 'body')
				htmlTransform.extendAttributes(node, { 'class': bodyCssClass });
			return node;
		}

		return dis;
	});