define(['src/code/htmlElements'], function (htmlElements) {
	var dis = {};
	dis.create = create;

	function create(menu) {
		return {
			filePath: menu.featureName + '/' + menu.featureName + '.html',
			getDefinition: getDefinition
		};
	}

	function getDefinition() {
		var linkAttributes = { 'href': ' #/{{option.path}}', 'style': 'display: block' };
		var link = htmlElements.node('a', '{{option.optionName}}', linkAttributes);
		var liAttributes = { 'ng-repeat': 'option in area.options', 'style': 'margin-top: 12px;' };
		var li = htmlElements.node('li', [link], liAttributes);
		var ul = htmlElements.node('ul', [li]);
		return htmlElements.node('div', [ul], { 'ng-repeat': 'area in model.areas' });
	}

	return dis;
});