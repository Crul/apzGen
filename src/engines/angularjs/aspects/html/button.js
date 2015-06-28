define(['src/code/html/htmlTransform'],
	function (htmlTransform) {
		var dis = {};
		dis.process = processButton;

		function processButton(node) {
			if (node[0] == 'button')
				htmlTransform.changeAttributeName(node, 'click', 'ng-click');
			return node;
		}

		return dis;
	});