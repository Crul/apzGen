define(['src/code/html/htmlTransform'],
	function (htmlTransform) {
		var tableCssClass = 'table table-striped table-bordered table-hover';
		var dis = {};
		dis.process = processTable;

		function processTable(node) {
			if (node[0] == 'table')
				htmlTransform.extendAttributes(node, { 'class': tableCssClass });
			return node;
		}

		return dis;
	});