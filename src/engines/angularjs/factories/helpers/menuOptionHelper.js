define([], function () {
	var dis = {};
	dis.getMenuOption = getMenuOption;

	function getMenuOption(featureName, component) {
		return {
			path: featureName + (component.route || ''),
			optionName: featureName + (component.menuOption || '')
		};
	}

	return dis;
});