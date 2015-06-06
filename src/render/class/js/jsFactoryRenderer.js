define(['src/render/class/js/jsHelper', 'src/render/class/js/jsFunctionRenderer'],
	function (jsHelper, jsFunctionRenderer) {
		var dis = require('util')._extend({}, jsFunctionRenderer);
		dis.render = render;

		var constants = { dis: 'dis' };

		function render(factoryConfig) {
			var functionName = factoryConfig.functionName;
			var body = renderFactoryBody(factoryConfig);
			var dependencies = factoryConfig.dependencies;
			return jsFunctionRenderer.render(functionName, body, dependencies);
		}

		function renderFactoryBody(factoryConfig) {
			var fooFn = {
				body: [
					jsHelper.variables.declare(constants.dis, jsHelper.constants.emptyObject),
					(factoryConfig.functions || []).map(renderFunction).join('\n'),
					jsHelper.return(constants.dis)
				]
			};
			return renderBody(fooFn);
		}

		function renderFunction(fn) {
			var code = '';
			if (fn.isPublic) {
				var propertyName = fn.isPublic.propertyName || fn.functionName;
				code = jsHelper.variables.assign(constants.dis + '.' + propertyName, fn.functionName).render() + jsHelper.constants.eol;
			}

			var body = renderBody(fn);
			code += jsFunctionRenderer.render(fn.functionName, body, fn.parameters);
			return code;
		}

		function renderBody(fn) {
			var fnBody = (fn.body || []);
			if (!Array.isArray(fnBody))
				fnBody = [fnBody];

			var body = fnBody.map(jsHelper.renderJs).join('') + jsHelper.constants.eol;
			body += (fn.functions || []).map(renderFunction).join('\n');
			return body;
		}

		return dis;
	});