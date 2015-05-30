define([], function () {
	var dis = {};
	dis.render = render;
	dis.toString = toString;
	dis.ident = ident;

	var code = '';
	var variablePatternSeed;
	var variablePattern;

	function render(template, data, _variablePatternSeed) {
		setVariablePatternData(_variablePatternSeed);
		data = data || {};

		var rendered = template;
		var variableTokens = (template.match(variablePattern) || []);
		variableTokens.forEach(_renderVariableToken);
		code = rendered;
		return rendered;

		function _renderVariableToken(variableToken) { // _ because naming collision
			rendered = renderVariableToken(rendered, data, variableToken);
		}
	}

	function setVariablePatternData(_variablePatternSeed) {
		variablePatternSeed = _variablePatternSeed || '{namePattern}';
		variablePattern = getVariableRegex('[a-zA-Z]+');
	}

	function renderVariableToken(template, data, variableToken) {
		for (var property in data) { // not [].forEach() because iterating {}
			template = renderProperty(template, data, property, variableToken);
		}
		return template;
	}

	function renderProperty(template, data, property, variableToken) {
		var matches = variableToken.match(getVariableRegex(property));
		if (matches) {
			var value = data[property] || '';
			template = template.replace(variableToken, value);
		}
		return template;
	}

	function getVariableRegex(namePattern) {
		var regex = variablePatternSeed.replace(/namePattern/g, namePattern);
		return new RegExp(regex, 'g');
	}

	function toString() {
		return code;
	}

	function ident(code) {
		return (code || '').replace(/(\r\n|\n|\r)/gm, '\r\n\t').replace(/^/, '\t');
	}

	return dis;
});