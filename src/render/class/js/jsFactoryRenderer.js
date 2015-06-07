define(['src/default/render/classRenderer'],
	function (js) {
		var dis = require('util')._extend({}, js);
		dis.render = render;

		var constants = { dis: 'dis' };

		function render(factoryConfig) {
			factoryConfig.body = renderFactoryBody(factoryConfig);
			return dis.functions.render(factoryConfig);
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
			var code = [];
			if (fn.isPublic) {
				var propertyName = js.access(constants.dis,(fn.isPublic.propertyName || fn.functionName));
				code.push(js.concatJs(dis.variables.assign(propertyName, fn.functionName), dis.constants.eol));
			}

			fn.body = renderBody(fn);
			code = code.concat(dis.functions.render(fn));

			return code.map(dis.renderJs).join('') + dis.constants.eol;;
		}

		function renderBody(fn) {
			var fnBody = (fn.body || []);
			if (!Array.isArray(fnBody))
				fnBody = [fnBody];

			var functionsCode = (fn.functions || []).map(renderFunction);
			return fnBody.concat(functionsCode);
		}

		return dis;
	});