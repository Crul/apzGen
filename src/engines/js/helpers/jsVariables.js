define(['src/engines/js/helpers/jsUtils'], function (jsUtils) {
	var dis = {};

	dis.declare = jsUtils.renderWrap(declareVariable);
	dis.assign = jsUtils.renderWrap(assign);
	dis.defaultValue = jsUtils.renderWrap(defaultValue);
	dis.defaultInitialization = jsUtils.renderWrap(defaultInitialization);

	function declareVariable(variableName, value) {
		return 'var ' + assign(variableName, value);
	}

	function assign(leftSide, rightSide) {
		return jsUtils.renderJsNoEol(leftSide) + ' = ' + jsUtils.renderJsNoEol(rightSide);
	}

	function defaultValue(variableName, value) {
		variableName = jsUtils.renderJsNoEol(variableName);
		value = jsUtils.renderJsNoEol(value);
		return '(' + variableName + ' || ' + value + ')';
	}

	function defaultInitialization(variableName, value) {
		variableName = jsUtils.renderJsNoEol(variableName);
		return assign(variableName, defaultValue(variableName, value));
	}

	return dis;
});