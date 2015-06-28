define(['src/engines/angularjs/templates/templateService'],
	function (templateService) {
		var util = require('util');
		var dis = {};
		dis.initControl = initControl;

		function initControl(field, iudControl, preloadConfig) {
			var control = util._extend(field, iudControl);
			control.controlType = control.controlType || control.fieldType || 'text';
			control.inputId = control.inputId || control.fieldName;
			control.label = control.label || control.fieldName;
			control.value = 'model.' + control.fieldName;
			setControlTemplate(control);
			setPreloadFromForeingKey(control, preloadConfig);
			return control;
		}

		function setPreloadFromForeingKey(control, preloadConfig) {
			if (preloadConfig && control.foreingKey)
				preloadConfig.push(control.foreingKey.entity || control.fieldName);
		}

		function setControlTemplate(control) {
			switch (control.controlType) {
				case 'dropdownList':
					control.controlTemplate = templateService.getTemplateLambda('dropdownListControl');
					var _meta = control._meta || {};
					if (typeof (_meta) === 'string')
						_meta = JSON.parse(_meta);
						
					_meta.dropdownList = {
						entityName: control.foreingKey.entity,
						valueField: control.foreingKey.fieldName,
						labelField: control.dropdownListOptionLabel
					}; 
					control._meta = JSON.stringify(_meta);
					break;
			}
		}

		return dis;
	});