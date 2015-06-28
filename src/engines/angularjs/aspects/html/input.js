define(['src/code/html/htmlTransform'],
	function (htmlTransform) {
		var kendouiDropdownListAttribute = 'kendo-drop-down-list';
		var dis = {};
		dis.process = processInput;

		function processInput(node) {
			switch (node[0]) {
				case 'input':
					htmlTransform.changeAttributeName(node, 'value', 'ng-model');
					break;
				case 'select':
					htmlTransform.changeAttributeName(node, 'value', 'ng-model');
					procesSelectOptions(node);
					break;
			}
			return node;
		}

		function procesSelectOptions(node) {
			if (node[1][kendouiDropdownListAttribute])
				return;

			var _meta = node[1]._meta || {};
			if (typeof (_meta) === 'string')
				_meta = JSON.parse(_meta);

			var dataSource = _meta.dropdownList.dataSource;
			var valueField = _meta.dropdownList.valueField || 'id';
			var labelField = _meta.dropdownList.labelField || _meta.dropdownList.valueField || 'name';
			var ngOptions = 'item.' + valueField + ' as item.' + labelField + ' for item in ' + dataSource;
			htmlTransform.extendAttributes(node, { 'ng-options': ngOptions });
		}

		return dis;
	});