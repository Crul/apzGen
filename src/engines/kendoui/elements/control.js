define(['src/code/html/htmlTransform'],
	function (htmlTransform) {
		var numericInputAttribute = 'kendo-numeric-text-box';
		var dropdownListAttribute = 'kendo-drop-down-list';
		var dropdownListDataSourceAttribute = 'k-data-source';
		var dropdownListLabelFieldAttribute = 'k-data-text-field';
		var dropdownListValueFieldAttribute = 'k-data-value-field';
		var bootstrapCssClassToRemoveInNumeric = 'form-control';

		var dis = {};
		dis.process = processControl;

		function processControl(node) {
			switch (node[0]) {
				case 'input':
					processInput(node);
					break;
				case 'select':
					processDropodownList(node);
					break;
			}
			return node;
		}

		function processInput(node) {
			if (node.length < 2)
				node.push({});

			switch (node[1].type) {
				case 'numeric':
					node[1][numericInputAttribute] = '';
					if (node[1].class)
						node[1].class = node[1].class.replace(bootstrapCssClassToRemoveInNumeric, '').replace(/  /g, ' ');
					break;
			}
		}

		function processDropodownList(node) {
			if (node.length < 2)
				node.push({});

			var _meta = node[1]._meta;
			if (typeof (_meta) === 'string')
				_meta = JSON.parse(_meta);

			var attrs = {};
			attrs[dropdownListAttribute] = 'foo'; // TODO avoid remove empty attributes
			attrs[dropdownListDataSourceAttribute] = _meta.dropdownList.dataSource;
			attrs[dropdownListLabelFieldAttribute] = "'" + _meta.dropdownList.labelField + "'";
			attrs[dropdownListValueFieldAttribute] = "'" + _meta.dropdownList.valueField + "'";
			htmlTransform.extendAttributes(node, attrs);
		}

		return dis;
	});