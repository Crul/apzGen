define(['src/code/js/elements/base'], function (base) {
	var dis = {};
	dis.createDeclaration = createVariableDeclaration;

	function createVariableDeclaration(variableName, value) {
		var declarations = [{
			"type": "VariableDeclarator",
			"id": base.createIdentifier(variableName),
			"init": value
		}];

		return {
			"type": "VariableDeclaration",
			"declarations": declarations,
			"kind": "var"
		};
	}

	return dis;
});