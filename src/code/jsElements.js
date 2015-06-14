define(['src/system/utils'], function (utils) {
	var dis = {};
	
	// TODO split function definition in files
	dis.program = createProgram;
	dis.call = createCall;
	dis.callFunction = createCallFunction;
	dis.objectDeclaration = createObjectDeclaration;
	dis.variableDeclaration = createVariableDeclaration;
	dis.functionDeclaration = createFunctionDeclaration;
	dis.return = createReturn;
	dis.access = createMemberExpression;
	dis.assign = createAssign;
	dis.array = createArray;
	dis.literal = createLiteral;
	dis.identifier = createIdentifier;
	dis.expressionStatement = createExpressionStatement;

	function createProgram(body) {
		return {
			"type": "Program",
			"body": [body]
		};
	}

	function createObjectDeclaration(object) {
		var objectExpression = {
			"type": "ObjectExpression",
			"properties": []
		};
		for (var propertyName in object) { // not [].forEach() because iterating {}
			var property = getProperty(propertyName, object[propertyName]);
			objectExpression.properties.push(property);
		}

		return objectExpression;
	}

	function getProperty(name, value) {
		if (Array.isArray(value)) {
			var arrayElements = value.map(getPropertyValue);
			value = createArray(arrayElements);
		} else {
			value = getPropertyValue(value);
		}

		return {
			"type": "Property",
			"key": createIdentifier(name),
			"computed": false,
			"value": value,
			"kind": "init",
			"method": false,
			"shorthand": false
		};
	}

	function createVariableDeclaration(variableName, value) {
		var declarations = [{
			"type": "VariableDeclarator",
			"id": createIdentifier(variableName),
			"init": value
		}];

		return {
			"type": "VariableDeclaration",
			"declarations": declarations,
			"kind": "var"
		};
	}

	function createAssign(left, right) {
		return {
            "type": "ExpressionStatement",
            "expression": {
                "type": "AssignmentExpression",
                "operator": "=",
                "left": left,
                "right": right
            }
        };
	}

	function createMemberExpression(objectName, propertyName) {
		return {
			"type": "MemberExpression",
			"computed": false,
			"object": createIdentifier(objectName),
			"property": createIdentifier(propertyName)
		};
	}

	function createFunctionDeclaration(functionName, bodyExpression, params) {
		params = utils.getArray(params);
		var paramsIdentifiers = params.map(createIdentifier);

		bodyExpression = (bodyExpression || []);
		// TODO multiple statements ?
		if (!Array.isArray(bodyExpression))
			bodyExpression = [createExpressionStatement(bodyExpression)];

		return {
			"type": "FunctionExpression",
			"id": createIdentifier(functionName),
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

	function createCall(callee, _arguments) {
		if (typeof (callee) == 'string')
			callee = createIdentifier(callee);

		return {
			"type": "CallExpression",
			"callee": callee,
			"arguments": utils.getArray(_arguments)
		};
	}

	function createCallFunction(calleeObj, functionName, _arguments) {
		if (typeof (calleeObj) === 'string')
			calleeObj = createIdentifier(calleeObj);

		if (typeof (functionName) === 'string')
			functionName = createIdentifier(functionName);

		var callee = {
			"type": "MemberExpression",
			"computed": false,
			"object": calleeObj,
			"property": functionName
		};

		return createCall(callee, _arguments);
	}

	function createReturn(returnArgument) {
		return {
			"type": "ReturnStatement",
			"argument": returnArgument
		};
	}

	function createArray(elements) {
		return {
			"type": "ArrayExpression",
			"elements": elements
		};
	}

	function createLiteral(value) {
		return {
			"type": "Literal",
			"value": value,
			"raw": "'" + value + "'"
		};
	}

	function createIdentifier(name) {
		return (!name ? null : {
			"type": "Identifier",
			"name": name
		});
	}

	function createExpressionStatement(expression) {
		return {
			"type": "ExpressionStatement",
			"expression": expression
		};
	}

	function getPropertyValue(value) {
		switch (typeof (value)) {
			case 'string':
				return createLiteral(value);
			case 'object':
				return createObjectDeclaration(value);
			default:
				return value;
		}
	}

	return dis;
});