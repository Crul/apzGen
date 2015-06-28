define([], function () {
	var dis = {};
	dis.createLiteral = createLiteral;

	function createLiteral(value) {
		return {
			"type": "Literal",
			"value": value,
			"raw": "'" + value + "'"
		};
	}

	return dis;
});