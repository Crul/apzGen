define(['src/code/html/htmlTransform'],
	function (htmlTransform) {
		var unorderedListCssClass = 'list-unstyled';
		var dis = {};
		dis.process = processUnorderedList;

		function processUnorderedList(node) {
			if (node[0] == 'ul')
				htmlTransform.extendAttributes(node, { 'class': unorderedListCssClass });
			return node;
		}

		return dis;
	});