define(
	[
		'src/render/class/js/helpers/jsUtils', 
		'src/render/class/js/helpers/jsConstants',
		'src/render/codeRenderer',
	],
	function (jsUtils, jsConstants, codeRenderer) {
		var dis = {};

		var variablePatternSeed = '\\/\\/\\{namePattern\\}|\\/\\*\\{namePattern\\}\\*\\/';
		var functionTemplate = '' +
			'function /*{functionName}*/(/*{parameters}*/) {\n' +
			'//{body}\n' +
			'}';

		dis.render = renderFunction;
		dis.return = jsUtils.renderWrap(executeReturn);
		dis.execute = jsUtils.renderWrap(executeFunction);
		dis.filters = {
			getIfNotNot: renderFunction('', executeReturn('!!_e') + jsConstants.eol, '_e')
		};

		function renderFunction(functionName, body, parameters) {
			if (parameters && !Array.isArray(parameters))
				parameters = [parameters];

			body = (body || '')
				.replace(/^/, '\t') 					// indent first line
				.replace(/\n/g, '\n\t') 				// indent non first lines
				.replace(/\n([ \t]*)(;*)$/mg, '')		// remove emtpy lines and alone ;
				.replace(/\{;/g, '\{')  				// remove {;
				.replace(/(\n)([ \t]*)\};/g, '$1$2\}'); // remove };
			
			var data = {
				functionName: functionName,
				body: body,
				parameters: (parameters || []).join(', ')
			};

			return codeRenderer.render(functionTemplate, data, variablePatternSeed);
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