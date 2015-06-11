define(
	[
		'src/engines/js/helpers/jsUtils',
		'src/engines/js/helpers/jsConstants',
		'src/render/codeRenderer'
	],
	function (jsUtils, jsConstants, codeRenderer) {
		var dis = {};

		var variablePatternSeed = '\\/\\/\\{namePattern\\}|\\/\\*\\{namePattern\\}\\*\\/';
		var functionTemplate = 'function /*{functionName}*/(/*{parameters}*/) {\n' +
			'//{body}\n' + '}';

		dis.declare = jsUtils.renderWrap(declareFunction);
		dis.return = jsUtils.renderWrap(executeReturn);
		dis.execute = jsUtils.renderWrap(executeFunction);
		dis.filters = {
			getIfNotNot: dis.declare({ body: executeReturn('!!_e'), parameters: '_e' })
		};

		function declareFunction(fnConfig) {
			var functionName = fnConfig.functionName || '';
			var body = renderBody(fnConfig);
			var parameters = getParameters(fnConfig);

			var fnData = {
				functionName: functionName,
				body: body,
				parameters: parameters
			};

			return codeRenderer.render(functionTemplate, fnData, variablePatternSeed);
		}

		function renderBody(fnConfig) {
			if (fnConfig.render)
				fnConfig = fnConfig.render();

			if (fnConfig.body && fnConfig.body.render)
				fnConfig.body = fnConfig.body.render();

			if (typeof (fnConfig) === 'string')
				fnConfig = { body: fnConfig };

			var body = fnConfig.body;
			if (Array.isArray(body))
				body = body.map(jsUtils.renderJs).join('');

			body = jsUtils.renderJs(body)
				.replace(/^/, '\t') 					// indent first line
				.replace(/\n/g, '\n\t') 				// indent non first lines
				.replace(/\n([ \t]*)(;*)$/mg, '')		// remove emtpy lines and alone ;
				.replace(/\{;/g, '\{')  				// remove {;
				.replace(/(\n)([ \t]*)\};/g, '$1$2\}'); // remove };
			
			return body;
		}

		function getParameters(fnConfig) {
			var parameters = (fnConfig.parameters || []).concat(fnConfig.dependencies || []);
			if (!Array.isArray(parameters))
				parameters = [parameters];
			return (parameters || []).join(', ');
		}

		function executeFunction(method, parameters) {
			parameters = parameters || [];
			if (!Array.isArray(parameters))
				parameters = [parameters];

			parameters = parameters.map(jsUtils.renderJsNoEol).join(', ');

			if (method.render)
				method = method.render();

			return method + '(' + (parameters || '') + ')';
		}

		function executeReturn(value) {
			if (value === undefined) // for "return undefined;" use constants.undefined
				value = '';

			value = jsUtils.renderJsNoEol(value);
			return 'return' + (value === '' ? '' : ' ') + value;
		}

		return dis;
	});