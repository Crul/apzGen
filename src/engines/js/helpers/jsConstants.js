define(['src/engines/js/helpers/jsUtils'],
	function (jsUtils) {
		return {
			_undefined: 'undefined',
			_this: 'this',
			_true: 'true',
			_false: 'false',
			_null: 'null',
			eol: jsUtils.eol,
			emptyObject: '{}',
			emptyString: "''",
			emptyArray: '[]'
		};
	});