define(['src/system/logger', 'src/system/utils', 'src/apzContext'],
	function (logger, utils, apzContext) {
		var dis = {};
		dis.wrapRender = wrapRender;
		dis.render = render;
		dis.toString = toString;
		dis.indent = indent;

		var code = '';
		var variablePatternSeed;
		var variablePattern;

		function wrapRender(fn) {
			function _wrappedFunction() {
				var _fn = fn;
				var _args = arguments;
				function render() {
					if (!apzContext.isRendering) {
						logger.error('jsUtils.render: RENDERING OUTSIDE RENDERING STAGE');
					}
					return _fn.apply(dis, _args);
				}
				return { render: render };
			}
			return _wrappedFunction;
		}

		function render(template, data, _variablePatternSeed) {
			setVariablePatternData(_variablePatternSeed);
			data = data || {};

			var rendered = template;
			var variableTokens = (template.match(variablePattern) || []);
			variableTokens.forEach(_renderVariableToken);
			code = rendered;
			return rendered;

			function _renderVariableToken(variableToken) {
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

		function indent(code) {
			return (code || '').replace(/(\r\n|\n|\r)/gm, '\r\n\t').replace(/^/, '\t');
		}

		return dis;
	});