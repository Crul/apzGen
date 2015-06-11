define(['src/engines/js/helpers/jsUtils', 'src/engines/js/helpers/jsFunctions'],
	function (jsUtils, jsFunctions) {
		var dis = {};

		dis.create = jsUtils.renderWrap(createObject);
		dis.value = jsUtils.renderWrap(valueObject);

		function createObject(objectName, params) {
			return 'new ' + jsFunctions.execute(objectName, params).render();
		}

		function valueObject(object) {
			var properties = [];
			for (var propertyName in object) { // not [].forEach() because iterating obj {}
				properties.push('\t' + propertyName + ': ' + jsUtils.renderJsNoEol(object[propertyName]));
			}

			var code = ['{', properties.map(indentExtraLines).join(',\n'), '}'];
			return code.map(jsUtils.renderJsNoEol).join('\n');
		}

		function indentExtraLines(property) {
			return property.replace(/\n/g, '\n\t'); // TODO move to indentNotFirstLine
			
		}

		return dis;
	});