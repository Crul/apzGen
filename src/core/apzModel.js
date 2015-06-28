define(['src/system/utils', 'src/system/logger', 'src/system/fsService'],
	function (utils, logger, fsService) {
		var util = require('util');
		var dis = {};
		dis.init = initModel;

		function initModel(apzDefinition) {
			if (typeof (apzDefinition.model) === 'string') {
				logger.trace('string model definition: reading ' + apzDefinition.model);
				apzDefinition.model = JSON.parse(fsService.readFile(apzDefinition.model));
			}
			apzDefinition.model = apzDefinition.model || {};
			apzDefinition.model.config = apzDefinition.model.config || {};
			apzDefinition.model.entities = apzDefinition.model.entities || {};

			initModelFields(apzDefinition.model);
		}

		function initModelFields(model) {
			model.config.default = model.config.default || {};
			var defaultEntity = model.config.default.entity || {};
			for (var entityName in model.entities) { // not [].forEach() because iterating {}
				var entity = model.entities[entityName];
				initEntityFields(defaultEntity, entity);
				var newEntity = util._extend({}, defaultEntity);
				model.entities[entityName] = util._extend(newEntity, entity);
			}
		}

		function initEntityFields(defaultEntity, entity) {
			var fields = (defaultEntity.fields.slice(0) || []);
			(entity.fields || []).forEach(addEntityField);
			fields = fields.map(initField);
			entity.fields = utils.arrays.distinct(fields, compareFieldName);

			function addEntityField(entityField) {
				var existingEntity = fields.filter(getByEntityFieldName);
				if (existingEntity.length === 0) {
					fields.push(entityField);
				} else {
					var fieldIndex = fields.indexOf(existingEntity[0]);
					fields[fieldIndex] = util._extend(fields[fieldIndex], entityField);
				}

				function getByEntityFieldName(field) {
					return field.fieldName == entityField.fieldName;
				}
			}
		}

		function initField(field) {
			if (typeof (field) === 'string')
				field = { fieldName: field };
			return field;
		}

		function compareFieldName(a, b) {
			return a.fieldName == b.fieldName;
		}

		return dis;
	});