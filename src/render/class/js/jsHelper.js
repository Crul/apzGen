// TODO move to classRenderer hierarchy
// TODO rename to js
// TODO split in files (constatns, conditional, compare, variables, functions...)
define([], function () {
	var dis = {};

	dis.constants = {
		_this: 'this',
		_true: 'true',
		_false: 'false',
		_null: 'null',
		eol: ';\n',
		emptyObject: '{}',
		emptyString: "''",
		emptyArray: arrayValue()
	};

	dis.access = accessRenderer;
	dis.concatJs = concatJsRenderer;
	dis.renderJs = renderJs;
	dis.conditional = {
		if: ifRenderer,
		ifNot: renderWrap(ifNot),
		ifNotNot: renderWrap(ifNotNot),
		iif: iifRenderer,
		ifNotConfirm: renderWrap(ifNotConfirm),
		ifConfirm: renderWrap(ifConfirm),
	}
	dis.compare = {
		equals: renderWrap(equals),
		exactEquals: renderWrap(exactEquals),
		gt: renderWrap(greaterThan)
	};

	dis.variables = {
		declare: declareVariableRenderer,
		assign: assignRenderer,
		defaultValue: defaultValueRenderer,
		defaultInitialization: defaultInitializationRenderer
	};
	dis.return = returnRenderer; // TODO move to functions?
	dis.functions = {
		execute: executeRenderer,
		filters: {
			getIfNotNot: 'function (_e) { return !!_e; }'
		}
	};
	dis.arrays = {
		value: renderWrap(arrayValue),
		elementAt: renderWrap(elementAt),
		indexOf: renderWrap(indexOf)
	};
	dis.loops = {
		forVarIn: renderWrap(forVarIn)
	};
	dis.notifier = {
		notify: notifyRenderer,
		confirm: confirmRenderer
	};

	function renderWrap(fn) {
		function _wrappedFunction() {
			var _fn = fn;
			var _args = arguments;
			function render() {
				return _fn.apply(dis, _args);
			}
			return { render: render };
		}
		return _wrappedFunction;
	}

	function renderJs(elem, avoidEol) { // multiple returns	
		if (elem === undefined) return '';

		var eol = (avoidEol === true ? '' : dis.constants.eol);
		if (typeof (elem) === 'string')
			return elem + eol;

		if (elem.render)
			return elem.render() + eol;

		return JSON.stringify(elem) + eol;
	}

	function renderJsNoEol(elem) { // TODO refactor
		return renderJs(elem, true);
	}

	function accessRenderer(leftSide, rightSide) {
		rightSide = concatJsRenderer('.', rightSide);
		return concatJsRenderer(leftSide, rightSide);
	}

	function concatJsRenderer(leftSide, rightSide) {
		function render() {
			return renderJsNoEol(leftSide) + renderJsNoEol(rightSide);
		}
		return { render: render };
	}

	function ifRenderer(condition, ifTrueBody, elseBody) {
		function render() {
			return getIf(renderJsNoEol(condition), renderJsNoEol(ifTrueBody), renderJsNoEol(elseBody));
		}
		return { render: render };
	}

	function getIf(condition, ifTrueBody, elseBody) {
		if (Array.isArray(ifTrueBody))
			ifTrueBody = ifTrueBody.map(renderJs).join('');

		if (Array.isArray(elseBody))
			elseBody = elseBody.map(renderJs).join('');

		var code = 'if (' + condition + ') {' + dis.constants.eol;
		code += indent(ifTrueBody) + dis.constants.eol;
		code += '}';
		if (elseBody) {
			code += ' else {' + dis.constants.eol;
			code += indent(elseBody) + dis.constants.eol;
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

	function iifRenderer(condition, trueValue, falseValue) {
		function render() {
			return '(' + renderJsNoEol(condition) + ' ? ' + renderJsNoEol(trueValue) + ' : ' + renderJsNoEol(falseValue) + ')';
		}
		return { render: render };
	}

	function ifConfirm(confirmMessage, ifTrueBody, elseBody) {
		var executeConfirm = confirmRenderer(confirmMessage).render();
		return getIf(executeConfirm, ifTrueBody, elseBody);
	}

	function ifNotConfirm(confirmMessage, ifTrueBody, elseBody) {
		var executeConfirm = confirmRenderer(confirmMessage).render();
		return ifNot(executeConfirm, ifTrueBody, elseBody);
	}

	function declareVariableRenderer(variableName, value) {
		function render() {
			return 'var ' + variableName + ' = ' + renderJsNoEol(value);
		}
		return { render: render };
	}

	function assignRenderer(leftSide, rightSide) {
		function render() {
			return renderJsNoEol(leftSide) + ' = ' + renderJsNoEol(rightSide);
		}
		return { render: render };
	}

	function defaultValueRenderer(variableName, value) {
		function render() {
			return defaultValue(renderJsNoEol(variableName), renderJsNoEol(value));
		}
		return { render: render };
	}

	function defaultValue(variableName, value) {
		return '(' + variableName + ' || ' + value + ')';
	}

	function defaultInitializationRenderer(variableName, value) {
		function render() {
			variableName = renderJsNoEol(variableName);
			return variableName + ' = ' + defaultValue(variableName, value);
		}
		return { render: render };
	}

	function executeRenderer(method, parameters) {

		function render() {
			return executeFunction(method, parameters);
		}
		return { render: render };
	}

	function executeFunction(method, parameters) {
		parameters = parameters || [];
		if (!Array.isArray(parameters))
			parameters = [parameters];

		parameters = parameters.map(renderJsNoEol).join(', ');

		if (method.render)
			method = method.render();

		return method + '(' + (parameters || '') + ')';
	}

	function returnRenderer(value) {
		function render() {
			if (value === undefined) // for "return undefined;" use constants.undefined
				value = '';

			value = renderJsNoEol(value);
			return 'return' + (value === '' ? '' : ' ') + value;
		}
		return { render: render };
	}

	function arrayValue(values) {
		if (Array.isArray(values))
			values = values.join(', ');

		if (values === undefined)
			values = '';

		return '[' + values + ']';
	}

	function elementAt(array, position) {
		return array + arrayValue(position);
	}

	function indexOf(array, element) {
		return array + '.indexOf(' + element + ')';
	}

	function equals(leftSide, rightSide) {
		return leftSide + ' == ' + rightSide;
	}

	function exactEquals(leftSide, rightSide) {
		return leftSide + ' === ' + rightSide;
	}

	function greaterThan(leftSide, rightSide) {
		return leftSide + ' > ' + rightSide;
	}

	function forVarIn(forIndex, inModel, loopBody) {
		if (Array.isArray(loopBody))
			loopBody = loopBody.map(renderJs).join('');

		var code = 'for (var ' + forIndex + ' in ' + inModel + ') {' + dis.constants.eol;
		code += indent(loopBody) + dis.constants.eol;
		code += '}';
		return code;
	}

	function notifyRenderer(message) {
		function render() {
			// TODO inject notifier
			return executeFunction('alert', '"' + message + '"');
		}
		return { render: render };
	}

	function confirmRenderer(message) {
		function render() {
			// TODO inject notifier
			return executeFunction('confirm', '"' + message + '"');
		}
		return { render: render };
	}

	function indent(code) {
		return renderJs(code || '').replace(/^/, '\t').replace(/\n/g, '\n\t');
	}

	return dis;
});