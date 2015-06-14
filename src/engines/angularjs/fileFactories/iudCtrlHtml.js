define(['src/code/htmlElements'], function (htmlElements) {
	var dis = {};
	dis.create = create;

	function create(feature) {
		var featureName = feature.featureName || 'list';
		var filePath = featureName + '/' + featureName + '.html';
		var fields = feature.fields || [];

		return {
			filePath: filePath,
			getDefinition: getDefinition
		};

		function getDefinition() { 
			// TODO wrap angularjs routes
			var backLink = htmlElements.node('a', 'back', { href: '#/' + featureName + '/list' });
			var controls = fields.map(createControl);
			var form = htmlElements.node('form', controls);
			var saveButton = htmlElements.node('button', 'save', { 'click': 'save()' });
			return htmlElements.node('div', [backLink, form, saveButton]);
		}

		function createControl(field) {
			var fieldName = field.fieldName || field;
			var fieldLabel = field.label || field.fieldName || field;
			var label = htmlElements.node('label', fieldLabel, { 'for': fieldName });
			var inputAttributes = {
				'id': fieldName,
				'value': 'model.' + fieldName,
				_meta: { fieldType: field.fieldType }
			};
			var input = htmlElements.node('input', '', inputAttributes);
			return htmlElements.node('div', [label, input]);
		}
	}

	return dis;
});