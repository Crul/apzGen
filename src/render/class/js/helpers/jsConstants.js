define(['src/render/class/js/helpers/jsUtils', 'src/render/class/js/helpers/jsArrays'],
	function (jsUtils, jsArrays) {
		return {
			_this: 'this',
			_true: 'true',
			_false: 'false',
			_null: 'null',
			eol: jsUtils.eol,
			emptyObject: '{}',
			emptyString: "''",
			emptyArray: jsArrays.value().render()
		};
	});