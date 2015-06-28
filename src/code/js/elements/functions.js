define(['src/system/utils', 'src/code/js/elements/base'],
	function (utils, base) {
		var dis = {};

		dis.createFunctionDeclaration = createFunctionDeclaration;
		dis.createCallFunction = createCallFunction;

		function createFunctionDeclaration(functionName, bodyExpression, params) {
			params = utils.getArray(params);
			var paramsIdentifiers = params.map(base.createIdentifier);

			bodyExpression = (bodyExpression || []);
			if (!Array.isArray(bodyExpression)) // TODO multiple statements ?
				bodyExpression = [base.createExpressionStatement(bodyExpression)];

			var nodeType = 'Function' + (!functionName ? 'Expression' : 'Declaration');
			return {
				"type": nodeType,
				"id": base.createIdentifier(functionName),
				"params": paramsIdentifiers,
				"defaults": [],
				"body": {
					"type": "BlockStatement",
					"body": bodyExpression
				},
				"generator": false,
				"expression": false
			};
		}

		function createCallFunction(calleeObj, functionName, _arguments) {
			if (typeof (calleeObj) === 'string')
				calleeObj = base.createIdentifier(calleeObj);

			if (typeof (functionName) === 'string')
				functionName = base.createIdentifier(functionName);

			var callee = base.createMemberExpression(calleeObj, functionName);
			return createCallExpression(callee, _arguments);
		}

		function createCallExpression(callee, _arguments) {
			if (typeof (callee) == 'string')
				callee = base.createIdentifier(callee);

			return {
				"type": "CallExpression",
				"callee": callee,
				"arguments": utils.getArray(_arguments)
			};
		}

		return dis;
	});