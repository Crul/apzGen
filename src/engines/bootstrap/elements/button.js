define(['src/code/html/htmlTransform'],
	function (htmlTransform) {
		var btnCssClass = 'btn btn-default';
		var dis = {};
		dis.process = processButton;

		function processButton(node) {
			if (node[0] == 'button' || node[0] == 'a')
				htmlTransform.extendAttributes(node, { 'class': btnCssClass });
			return node;
		}

		return dis;
	});