define(['src/render/class/js/jsRenderer'],
	function (js) {
		var dis = require('util')._extend({}, js);
		dis.render = render;

		var constants = { dis: 'dis' };

		function render(factoryConfig) {
			var functionName = factoryConfig.functionName;
			var body = renderFactoryBody(factoryConfig);
			var dependencies = factoryConfig.dependencies;
			return dis.functions.render(functionName, body, dependencies);
		}

		function renderFactoryBody(factoryConfig) {
			var fooFn = {
				body: [
					dis.variables.declare(constants.dis, dis.constants.emptyObject),
					(factoryConfig.functions || []).map(renderFunction).join('\n'),
					dis.return(constants.dis)
				]
			};
			return renderBody(fooFn);
		}

		function renderFunction(fn) {
			var code = '';
			if (fn.isPublic) {
				var propertyName = fn.isPublic.propertyName || fn.functionName;
				code = dis.variables.assign(constants.dis + '.' + propertyName, fn.functionName).render() + dis.constants.eol;
			}

			var body = renderBody(fn);
			code += dis.functions.render(fn.functionName, body, fn.parameters);
			return code;
		}

		function renderBody(fn) {
			var fnBody = (fn.body || []);
			if (!Array.isArray(fnBody))
				fnBody = [fnBody];

			var body = fnBody.map(dis.renderJs).join('') + dis.constants.eol;
			body += (fn.functions || []).map(renderFunction).join('\n');
			return body;
		}

		return dis;
	});