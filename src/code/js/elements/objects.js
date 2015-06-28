define(['src/code/js/elements/base', 'src/code/js/elements/arrays', 'src/code/js/elements/strings'],
	function (base, arrays, strings) {
		var dis = {};
		dis.createObjectDeclaration = createObjectDeclaration;

		function createObjectDeclaration(object) {
			var objectExpression = {
				"type": "ObjectExpression",
				"properties": []
			};
			for (var propertyName in object) { // not [].forEach() because iterating {}
				var property = createProperty(propertyName, object[propertyName]);
				objectExpression.properties.push(property);
			}

			return objectExpression;
		}

		function createProperty(name, value) {
			if (Array.isArray(value)) {
				var arrayElements = value.map(getPropertyValue);
				value = arrays.createArray(arrayElements);
			} else {
				value = getPropertyValue(value);
			}

			return {
				"type": "Property",
				"key": base.createIdentifier(name),
				"computed": false,
				"value": value,
				"kind": "init",
				"method": false,
				"shorthand": false
			};
		}

		function getPropertyValue(value) {
			switch (typeof (value)) {
				case 'string':
					return strings.createLiteral(value);
				case 'object':
					return createObjectDeclaration(value);
				default:
					return value;
			}
		}

		return dis;
	});