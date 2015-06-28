define(['src/code/html/htmlTransform'],
	function (htmlTransform) {
		var dis = {
			aspectName: 'angularjsHtml',
			applyTo: applyTo,
			intercept: intercept
		};

		var kendouiDropdownListAttribute = 'kendo-drop-down-list';
		function applyTo(apzFile) {
			return apzFile.filePath.match(/.html$/);
		}

		function intercept(code) {
			htmlTransform.nodeVisitor(code, [processInput, processButton]);
			return code;
		}

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

			var entityName = _meta.dropdownList.entityName;
			var valueField = _meta.dropdownList.valueField || 'id';
			var labelField = _meta.dropdownList.labelField || _meta.dropdownList.valueField || 'name';
			var ngOptions = 'item.' + valueField + ' as item.' + labelField + ' for item in data.' + entityName + '.list';
			htmlTransform.extendAttributes(node, { 'ng-options': ngOptions });
		}

		function processButton(node) {
			if (node[0] == 'button')
				htmlTransform.changeAttributeName(node, 'click', 'ng-click');
			return node;
		}

		return dis;
	});