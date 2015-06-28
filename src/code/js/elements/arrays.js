define([], function () {
	var dis = {};
	dis.createArray = createArray;

	function createArray(elements) {
		return {
			"type": "ArrayExpression",
			"elements": elements
		};
	}


	return dis;
});