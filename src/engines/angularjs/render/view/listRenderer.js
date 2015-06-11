define(['src/render/renderService'],
	function (renderService) {
		var html = renderService.view.renderer;
		var dis = {};
		dis.render = render;

		var listTableBodyAttributes = 'ng-repeat="entity in model[entityName].list"';
		var listTableActionColumns = [' ', ' '];
		var listTableActionCells = ['edit', 'remove'].map(renderActionCell).join('');

		function render(apzFile) {
			var feature = apzFile.feature;
			var featureName = feature.featureName;
			var view = html.renderLinkButton('back', '#/'); // TODO back > renderBackButton() { history.back }
			view += html.renderLinkButton('new ' + featureName, '#/' + featureName + '/edit/new'); // TODO access routes by properties
			view += html.renderTitle(featureName);
			var htmlTableConfig = getTableConfig(feature);
			view += html.renderTable(htmlTableConfig);
			return view;
		}

		function getTableConfig(feature) {
			var columns = feature.angularjs.model.fields.map(getFieldName);
			var tableConfig = { columns: columns || [] };
			var modelCells = (tableConfig.columns || []).map(renderModelCell).join('');
			var cells = listTableActionCells.concat(modelCells);
			tableConfig.columns = listTableActionColumns.concat(tableConfig.columns);
			tableConfig.body = html.renderTableRow(cells, listTableBodyAttributes);
			return tableConfig;
		}
		
		function getFieldName(field){
			return field.fieldName;
		}

		function renderActionCell(action) {
			var actionButton = html.renderButton(action, action + '(entity)', '', 'ng-click');
			return html.renderTableCell(actionButton);
		}

		function renderModelCell(column) {
			return html.renderTableCell(column, html.renderAttr('ng-bind', 'entity.' + column));
		}

		return dis;
	});