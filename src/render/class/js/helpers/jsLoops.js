define(['src/render/class/js/helpers/jsUtils', 'src/render/class/js/helpers/jsConstants'],
	function (jsUtils, jsConstants) {
		var dis = {};

		dis.forVarIn = jsUtils.renderWrap(forVarIn);

		function forVarIn(forIndex, inModel, loopBody) {
			if (Array.isArray(loopBody))
				loopBody = loopBody.map(jsUtils.renderJs).join('');

			var code = 'for (var ' + forIndex + ' in ' + inModel + ') {' + jsConstants.eol;
			code += jsUtils.indent(loopBody) + jsConstants.eol;
			code += '}';
			return code;
		}

		return dis;
	});