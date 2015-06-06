// TODO move to classRenderer hierarchy
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

	dis.renderJs = renderJs;
	// TODO dis.conditional = {
	dis.if = renderWrap(getIf);
	dis.ifNot = renderWrap(ifNot);
	dis.ifNotNot = renderWrap(ifNotNot);
	dis.iif = renderWrap(getIif);
	dis.ifNotConfirm = renderWrap(ifNotConfirm);
	dis.ifConfirm = renderWrap(ifConfirm);
	//}
	dis.compare = {
		equals: renderWrap(equals),
		exactEquals: renderWrap(exactEquals),
		gt: renderWrap(greaterThan)
	};

	dis.variables = {
		declare: renderWrap(declareVariable),
		assign: renderWrap(assign),
		defaultValue: renderWrap(defaultValue),
		defaultInitialization: renderWrap(defaultInitialization)
	};
	dis.return = renderWrap(executeReturn); // TODO move to functions?
	dis.functions = {
		execute: renderWrap(execute),
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

	function renderJs(elem) { // multiple returns
		if (typeof (elem) === 'string')
			return elem + dis.constants.eol;

		if (elem.render)
			return elem.render() + dis.constants.eol;

		return JSON.stringify(elem) + dis.constants.eol;
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

	function getIif(condition, trueValue, falseValue) {
		return '(' + condition + ' ? ' + trueValue + ' : ' + falseValue + ')';
	}

	function ifConfirm(confirmMessage, ifTrueBody, elseBody) {
		var executeConfirm = confirmRenderer(confirmMessage).render();
		return getIf(executeConfirm, ifTrueBody, elseBody);
	}

	function ifNotConfirm(confirmMessage, ifTrueBody, elseBody) {
		var executeConfirm = confirmRenderer(confirmMessage).render();
		return ifNot(executeConfirm, ifTrueBody, elseBody);
	}

	function declareVariable(variableName, value) {
		return 'var ' + variableName + ' = ' + value;
	}

	function assign(leftSide, rightSide) {
		return leftSide + ' = ' + rightSide;
	}

	function defaultValue(variableName, value) {
		return '(' + variableName + ' || ' + value + ')';
	}

	function defaultInitialization(variableName, value) {
		return variableName + ' = ' + defaultValue(variableName, value);
	}

	function execute(methodName, parameters) {
		if (Array.isArray(parameters))
			parameters = parameters.join(', ');
		return methodName + '(' + (parameters || '') + ')';
	}

	function executeReturn(value) {
		if (value === undefined) // for return undefined; use constants.undefined
			value = '';
		return 'return' + (value === '' ? '' : ' ') + value;
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
			return execute('alert', '"' + message + '"');
		}
		return { render: render };
	}

	function confirmRenderer(message) {
		function render() {
			// TODO inject notifier
			return execute('confirm', '"' + message + '"');
		}
		return { render: render };
	}

	function indent(code) {
		return renderJs(code || '').replace(/^/, '\t').replace(/\n/g, '\n\t');
	}

	return dis;
});