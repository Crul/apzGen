define(
	[
		'src/render/class/js/helpers/jsUtils',
		'src/render/class/js/helpers/jsConstants',
		'src/render/class/js/helpers/jsNotifier'
	],
	function (jsUtils, jsConstants, jsNotifier) {
		var dis = {};

		dis.if = jsUtils.renderWrap(getIf);
		dis.ifNot = jsUtils.renderWrap(ifNot);
		dis.ifNotNot = jsUtils.renderWrap(ifNotNot);
		dis.iif = jsUtils.renderWrap(getIif);
		dis.ifNotConfirm = jsUtils.renderWrap(ifNotConfirm);
		dis.ifConfirm = jsUtils.renderWrap(ifConfirm);

		function getIf(condition, ifTrueBody, elseBody) {
			if (Array.isArray(condition))
				condition = condition.map(jsUtils.renderJsNoEol).join('');
				
			if (Array.isArray(ifTrueBody))
				ifTrueBody = ifTrueBody.map(jsUtils.renderJs).join('');
			
			if (Array.isArray(elseBody))
				elseBody = elseBody.map(jsUtils.renderJs).join('');
			
			condition = jsUtils.renderJsNoEol(condition);
			ifTrueBody = jsUtils.renderJsNoEol(ifTrueBody);
			elseBody = jsUtils.renderJsNoEol(elseBody);
			
			var code = 'if (' + condition + ') {' + jsConstants.eol;
			code += jsUtils.indent(ifTrueBody) + jsConstants.eol;
			code += '}';
			if (elseBody) {
				code += ' else {' + jsConstants.eol;
				code += jsUtils.indent(elseBody) + jsConstants.eol;
				code += '}';
			}
			return code;
		}

		function ifNot(condition, body) {
			return getIf('!' + condition, body);
		}

		function ifNotNot(condition, body) {
			return ifNot('!' + condition, body);
		}

		function getIif(condition, trueValue, falseValue) {
			condition = jsUtils.renderJsNoEol(condition);
			trueValue = jsUtils.renderJsNoEol(trueValue);
			falseValue = jsUtils.renderJsNoEol(falseValue);
			return '(' + condition + ' ? ' + trueValue + ' : ' + falseValue + ')';
		}

		function ifConfirm(confirmMessage, ifTrueBody, elseBody) {
			var executeConfirm = jsNotifier.confirm(confirmMessage).render();
			return getIf(executeConfirm, ifTrueBody, elseBody);
		}

		function ifNotConfirm(confirmMessage, ifTrueBody, elseBody) {
			var executeConfirm = jsNotifier.confirm(confirmMessage).render();
			return ifNot(executeConfirm, ifTrueBody, elseBody);
		}

		return dis;
	});