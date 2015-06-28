define(['src/system/utils'], function (utils) {
	var dis = {};

	dis.createProgram = createProgram;
	dis.createAssign = createAssign;
	dis.createIdentifier = createIdentifier;
	dis.createExpressionStatement = createExpressionStatement;
	dis.createMemberExpression = createMemberExpression;

	function createProgram(body) {
		return {
			"type": "Program",
			"body": [body]
		};
	}

	function createAssign(left, right) {
		return createExpressionStatement({
			"type": "AssignmentExpression",
			"operator": "=",
			"left": left,
			"right": right
		});
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

	function createMemberExpression(_object, property) {
		return {
			"type": "MemberExpression",
			"computed": false,
			"object": _object,
			"property": property
		};
	}

	return dis;
});