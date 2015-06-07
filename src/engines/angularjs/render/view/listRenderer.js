define(['src/default/render/viewRenderer'],
	function (viewRenderer) {
		var dis = {};
		dis.render = render;

		var listTableBodyAttributes = 'ng-repeat="entity in model[entityName].list"';
		var listTableActionColumns = [' ', ' '];
		var listTableActionCells = ['edit', 'remove'].map(renderActionCell).join('');

		function render(apzFile) {
			var feature = apzFile.feature;
			var featureName = feature.featureName;
			var view = viewRenderer.renderLinkButton('back', '#/'); // TODO back > renderBackButton() { history.back }
			view += viewRenderer.renderLinkButton('new ' + featureName, '#/' + featureName + '/edit/new'); // TODO access routes by properties
			view += viewRenderer.renderTitle(featureName);
			var htmlTableConfig = getTableConfig(feature);
			view += viewRenderer.renderTable(htmlTableConfig);
			return view;
		}

		function getTableConfig(feature) {
			var columns = feature.angularjs.model.fields.map(getFieldName);
			var tableConfig = { columns: columns || [] };
			var modelCells = (tableConfig.columns || []).map(renderModelCell).join('');
			var cells = listTableActionCells.concat(modelCells);
			tableConfig.columns = listTableActionColumns.concat(tableConfig.columns);
			tableConfig.body = viewRenderer.renderTableRow(cells, listTableBodyAttributes);
			return tableConfig;
		}
		
		function getFieldName(field){
			return field.fieldName;
		}

		function renderActionCell(action) {
			var actionButton = viewRenderer.renderButton(action, action + '(entity)', '', 'ng-click');
			return viewRenderer.renderTableCell(actionButton);
		}

		function renderModelCell(column) {
			return viewRenderer.renderTableCell(column, viewRenderer.renderAttr('ng-bind', 'entity.' + column));
		}

		return dis;
	});