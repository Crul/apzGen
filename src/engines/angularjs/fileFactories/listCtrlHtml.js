define(['src/code/htmlElements'], function (htmlElements) {
	var dis = {};
	dis.create = create;

	var theadActionColumns = [' ', ' '];
	var tbodyActionButtons = ['edit', 'remove'].map(renderActionCell);
	function create(feature) {
		var featureName = feature.featureName || 'list';
		var filePath = featureName + '/' + featureName + '-list.html';
		return {
			filePath: filePath,
			getDefinition: getDefinition
		};

		function getDefinition() {
			// TODO wrap angularjs navigation routes
			var backLink = htmlElements.node('a', 'back', { href: '#/' });
			var newElementLink = htmlElements.node('a', 'new', { href: '#/' + featureName + '/edit/new' });
			var title = htmlElements.node('h1', featureName);

			var columns = feature.angularjs.model.fields.map(getFieldName);
			var trHead = htmlElements.node('tr', theadActionColumns.concat(columns).map(createTh));
			var thead = htmlElements.node('thead', [trHead]);

			var trAttributes = { 'ng-repeat': 'entity in model[entityName].list' };
			var tr = htmlElements.node('tr', tbodyActionButtons.concat(columns.map(createTd)), trAttributes);
			var tbody = htmlElements.node('tbody', [tr]);

			var table = htmlElements.node('table', [thead, tbody]);
			return htmlElements.node('div', [backLink, newElementLink, title, table]);
		}
	}

	function renderActionCell(action) {
		var button = htmlElements.node('button', action, { 'ng-click': action + '(entity)' });
		return htmlElements.node('td', [button]);
	}

	function createTh(column) {
		return htmlElements.node('th', column);
	}

	function createTd(column) {
		return htmlElements.node('td', '', { 'ng-bind': 'entity.' + column });
	}

	function getFieldName(field) {
		return field.fieldName;
	}


	return dis;
});