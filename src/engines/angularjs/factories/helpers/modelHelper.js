define([], function () {
	var util = require('util');
	var dis = {};
	dis.initModelField = initModelField;

	function initModelField(field) {
		if (typeof (field) === 'string')
			field = { fieldName: field };

		var control = util._extend(field);
		control.fieldType = control.fieldType || 'text';
		control.inputId = control.inputId || control.fieldName;
		control.label = control.label || control.fieldName;
		control.value = 'model.' + control.fieldName;
		return control;
	}

	return dis;
});