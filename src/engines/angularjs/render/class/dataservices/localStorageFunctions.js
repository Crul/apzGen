define(['src/render/renderService'],
	function (renderService) {
		var js = renderService.class.renderer;

		return { getFunctions: getFunctions };

		function getFunctions() {

			var $q = '$q';
			var localStorageService = 'localStorageService';
			var entityType = 'entityType';
			var id = 'id';
			var data = 'data';
			var model = 'model';
			var response = 'response';
			var entity = 'entity';
			var entityId = js.access(entity, id);
			var dataId = js.access(data, id);
			
			var simulateCallFn = { functionName: 'simulateCall', parameters: [response], body: getSimulateCallFnBody() };
			var getKeyFn = { functionName: 'getKey', parameters: [entityType], body: getGetKeyFnBody() };
			var executeGetKey = js.functions.execute(getKeyFn.functionName, entityType);
			
			var setModelFn = { functionName: 'setModel', parameters: [entityType, model], body: getSetModelFnBody() };
			var executeSetModel = js.functions.execute(setModelFn.functionName, [entityType, model]);
			
			var getModelFn = { functionName: 'getModel', parameters: [entityType], body: getGetModelFnBody() };
			var executeGetModel = js.functions.execute(getModelFn.functionName, entityType);
			var declareModelFromGetModel = js.variables.declare(model, executeGetModel);
			
			var generateIdFn = { functionName: 'generateId', parameters: [entityType], body: getGenerateIdFnBody() };

			var byIdFn = {
				functionName: '_byId',
				parameters: entity,
				body: [js.functions.return(js.compare.equals(entityId, id))]
			};
			var getByIdFn = {
				functionName: 'getById',
				parameters: [model, id],
				functions: [byIdFn],
				body: getGetByIdFnBody()
			};

			var getAllFn = {
				isPublic: true,
				functionName: 'getAll',
				parameters: [entityType],
				body: getGetAllFnBody()
			};

			var updateFn = { functionName: 'update', parameters: [model, data], body: getUpdateFnBody() };
			var insertFn = { functionName: 'insert', parameters: [model, data], body: getInsertFnBody() };
			
			var getEntityFn = {
				isPublic: { propertyName: 'get' },
				functionName: 'getEntity',
				parameters: [entityType, id],
				body: getGetEntityFnBody()
			};

			var setEntityFn = {
				isPublic: { propertyName: 'set' },
				functionName: 'setEntity',
				parameters: [entityType, data],
				body: getSetEntityFnBody()
			};

			var removeEntityFn = {
				isPublic: { propertyName: 'remove' },
				functionName: 'removeEntity',
				parameters: [entityType, id],
				body: getRemoveEntityFnBody()
			};

			return [getAllFn, getEntityFn, setEntityFn, removeEntityFn,
				getByIdFn, insertFn, updateFn, getModelFn, setModelFn, getKeyFn, generateIdFn, simulateCallFn];

			function getExecuteGetById(secondParam) {
				return js.functions.execute(getByIdFn.functionName, [model, secondParam]);
			}

			function getExecuteSimulateCall(param) {
				return js.functions.execute(simulateCallFn.functionName, param);
			}

			function getGetAllFnBody() {
				var executeGetModelOrDefault = js.variables.defaultValue(executeGetModel, js.constants.emptyArray);
				return [js.functions.return(getExecuteSimulateCall(executeGetModelOrDefault))];
			}

			function getGetEntityFnBody() {
				return [
					declareModelFromGetModel,
					js.functions.return(getExecuteSimulateCall(getExecuteGetById(id)))
				];
			}

			function getSetEntityFnBody() {
				var updated = 'updated';
				var body = [];
				body.push(declareModelFromGetModel);
				body.push(js.variables.declare(updated, js.constants._false));

				var executeUpdate = js.functions.execute(updateFn.functionName, [model, data]);
				var assignExecuteUpdateToUpdated = js.variables.assign(updated, executeUpdate);
				var executeGenerateId = js.functions.execute(generateIdFn.functionName, entityType);
				var assignExecuteGenerateIdToDataId = js.variables.assign(dataId, executeGenerateId);
				body.push(js.conditional.if(dataId, assignExecuteUpdateToUpdated, assignExecuteGenerateIdToDataId));

				var executeInsert = js.functions.execute(insertFn.functionName, [model, data]);
				body.push(js.conditional.ifNot(updated, executeInsert));
				body.push(executeSetModel);

				var executeSimulateCall = getExecuteSimulateCall(js.arrays.elementAt(model, dataId));
				body.push(js.functions.return(executeSimulateCall));

				return body;
			}

			function getRemoveEntityFnBody() {
				var removed = 'removed';
				var persistedEntity = 'persistedEntity';
				var indexOfEntity = 'indexOfEntity';
				var body = [];
				body.push(declareModelFromGetModel);
				body.push(js.variables.declare(persistedEntity, getExecuteGetById(id)));
				body.push(js.variables.declare(removed, js.constants._false));

				var ifIsPersistedEntity = [
					js.variables.declare(indexOfEntity, js.arrays.indexOf(model, persistedEntity)),
					js.functions.execute(js.access(model, 'splice'), [indexOfEntity, 1]),
					js.variables.assign(removed, js.constants._true)
				];
				body.push(js.conditional.ifNotNot(persistedEntity, ifIsPersistedEntity));
				body.push(executeSetModel);

				var executeSimulateCall = getExecuteSimulateCall(removed);
				body.push(js.functions.return(executeSimulateCall));

				return body;
			}

			function getGetByIdFnBody() {
				var entities = 'entities';
				var executeFilterModelById = js.functions.execute(js.access(model, 'filter'), byIdFn.functionName);
				var entitiesLengthGTZero = js.compare.gt(js.access(entities, 'length'), 0);
				var entitiesFirst = js.arrays.elementAt(entities, 0);
				var entitiesFirstOrDefault = js.conditional.iif(entitiesLengthGTZero, entitiesFirst, js.constants.emptyObject);
				return [
					js.variables.declare(entities, executeFilterModelById),
					js.functions.return(entitiesFirstOrDefault)
				];
			}

			function getInsertFnBody() {
				return [js.functions.execute(js.access(model, 'push'), data)];
			}

			function getUpdateFnBody() {
				var indexOfEntity = 'indexOfEntity';
				return [
					js.variables.declare(entity, getExecuteGetById(dataId)),
					js.conditional.ifNot(entity, js.functions.return(js.constants._false)),
					js.variables.declare(indexOfEntity, js.arrays.indexOf(model, entity)),
					js.variables.assign(js.arrays.elementAt(model, indexOfEntity), data),
					js.functions.return(js.constants._true)
				];
			}

			function getGetModelFnBody() {
				var executeLocalStorageGet = js.variables.defaultValue(
					js.functions.execute(js.access(localStorageService, 'get'), executeGetKey),
					js.constants.emptyArray);

				return [js.functions.return(executeLocalStorageGet)];
			}

			function getSetModelFnBody() {
				var modelOrDefault = js.variables.defaultValue(model, js.constants.emptyArray);
				var executeLocalStorageSet = js.functions.execute(js.access(localStorageService, 'set'), [executeGetKey, modelOrDefault]);
				return [executeLocalStorageSet];
			}

			function getGetKeyFnBody() {
				return js.functions.return(js.concatJs(entityType, " + 'List'"));
			}

			function getGenerateIdFnBody() {
				var ids = 'ids';
				var forIndex = 'e';
				var forLoopCode = [
					js.variables.declare(entity, js.arrays.elementAt(model, forIndex)),
					js.functions.execute(js.access(ids, 'push'), entityId)
				];
				var _Math_max_id = js.functions.execute('Math.max.apply', [js.constants._null, ids]);
				var _Math_max_id_plus_1 = js.concatJs(_Math_max_id, ' + 1');
				return [
					declareModelFromGetModel,
					js.variables.declare(ids, js.arrays.value(0)),
					js.loops.forVarIn(forIndex, model, forLoopCode), // not [].forEach() because iterating {}
					js.functions.return(_Math_max_id_plus_1)
				];
			}

			function getSimulateCallFnBody() {
				var deferred = 'deferred';
				return [
					js.variables.declare(deferred, js.functions.execute(js.access($q, 'defer'))),
					js.functions.execute(js.access(deferred, 'resolve'), response),
					js.functions.return(js.access(deferred, 'promise'))
				];
			}
		}
	});
