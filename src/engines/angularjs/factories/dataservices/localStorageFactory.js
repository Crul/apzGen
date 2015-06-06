define(['src/render/class/js/jsHelper', 'src/factories/class/js/jsFactory'],
	function (jsHelper, jsFactory) {
		var dis = {};
		dis.create = create;

		var $q = '$q';
		var localStorageService = 'localStorageService';
		var dataservice = 'dataservice';
		var entityType = 'entityType';
		var id = 'id';
		var data = 'data';
		var model = 'model';
		var response = 'response';
		var entity = 'entity';
		var entityId = entity + '.' + id;
		var dataId = data + '.' + id;

		var simulateCallFn = {
			functionName: 'simulateCall',
			parameters: [response],
			body: getSimulateCallFnBody()
		};

		var getKeyFn = {
			functionName: 'getKey',
			parameters: [entityType],
			body: getGetKeyFnBody()
		};
		var executeGetKey = jsHelper.functions.execute(getKeyFn.functionName, entityType).render();

		var setModelFn = {
			functionName: 'setModel',
			parameters: [entityType, model],
			body: getSetModelFnBody()
		};
		var executeSetModel = jsHelper.functions.execute(setModelFn.functionName, [entityType, model]).render();

		var getModelFn = {
			functionName: 'getModel',
			parameters: [entityType],
			body: getGetModelFnBody()
		};
		var executeGetModel = jsHelper.functions.execute(getModelFn.functionName, entityType).render();
		var declareModelFromGetModel = jsHelper.variables.declare(model, executeGetModel).render();

		var generateIdFn = {
			functionName: 'generateId',
			parameters: [entityType],
			body: getGenerateIdFnBody()
		};

		var byIdFn = {
			functionName: '_byId',
			parameters: entity,
			body: [jsHelper.return(jsHelper.compare.equals(entityId, id).render())]
		};

		var getByIdFn = {
			functionName: 'getById',
			parameters: [model, id],
			body: getGetByIdFnBody(),
			functions: [byIdFn]
		};

		var updateFn = {
			functionName: 'update',
			parameters: [model, data],
			body: getUpdateFnBody()
		};

		var insertFn = {
			functionName: 'insert',
			parameters: [model, data],
			body: getInsertFnBody()
		};


		var getAllFn = {
			isPublic: true,
			functionName: 'getAll',
			parameters: [entityType],
			body: getGetAllFnBody()
		};

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

		var functions = [getAllFn, getEntityFn, setEntityFn, removeEntityFn,
			getByIdFn, insertFn, updateFn, getModelFn, setModelFn, getKeyFn, generateIdFn, simulateCallFn];

		var config = {
			functionName: dataservice,
			dependencies: [$q, localStorageService],
			functions: functions
		};

		function create(definition) {
			var initializer = jsFactory.create(config);
			var apzFiles = [{
				fileType: 'class',
				path: 'seedwork/services',
				fileName: dataservice,
				renderer: definition.featureType
			}];

			initializer.apzFiles = apzFiles;
			initializer.angularjs = {
				factories: ['seedwork/services/' + dataservice + '.js']
			};

			return initializer;
		}

		function getExecuteGetById(secondParam) {
			return jsHelper.functions.execute(getByIdFn.functionName, [model, secondParam]).render();
		}

		function getExecuteSimulateCall(param) {
			return jsHelper.functions.execute(simulateCallFn.functionName, param).render();
		}

		function getGetAllFnBody() {
			var executeGetModelOrDefault = jsHelper.variables.defaultValue(executeGetModel, jsHelper.constants.emptyArray).render();
			return [jsHelper.return(getExecuteSimulateCall(executeGetModelOrDefault))];
		}

		function getGetEntityFnBody() {
			return [
				declareModelFromGetModel,
				jsHelper.return(getExecuteSimulateCall(getExecuteGetById(id)))
			];
		}

		function getSetEntityFnBody() {
			var updated = 'updated';

			var body = [];
			body.push(declareModelFromGetModel);
			body.push(jsHelper.variables.declare(updated, jsHelper.constants._false));

			var executeUpdate = jsHelper.functions.execute(updateFn.functionName, [model, data]).render();
			var assignExecuteUpdateToUpdated = jsHelper.variables.assign(updated, executeUpdate);
			var executeGenerateId = jsHelper.functions.execute(generateIdFn.functionName, entityType).render();
			var assignExecuteGenerateIdToDataId = jsHelper.variables.assign(dataId, executeGenerateId);
			body.push(jsHelper.if(dataId, assignExecuteUpdateToUpdated, assignExecuteGenerateIdToDataId));

			var executeInsert = jsHelper.functions.execute(insertFn.functionName, [model, data]);
			body.push(jsHelper.ifNot(updated, executeInsert));

			body.push(executeSetModel);

			var executeSimulateCall = getExecuteSimulateCall(jsHelper.arrays.elementAt(model, dataId).render());
			body.push(jsHelper.return(executeSimulateCall));

			return body;
		}

		function getRemoveEntityFnBody() {
			var removed = 'removed';
			var persistedEntity = 'persistedEntity';
			var indexOfEntity = 'indexOfEntity';

			var body = [];
			body.push(declareModelFromGetModel);
			body.push(jsHelper.variables.declare(persistedEntity, getExecuteGetById(id)));

			body.push(jsHelper.variables.declare(removed, jsHelper.constants._false));

			var ifIsPersistedEntity = [
				jsHelper.variables.declare(indexOfEntity, jsHelper.arrays.indexOf(model, persistedEntity).render()),
				jsHelper.functions.execute(model + '.splice', [indexOfEntity, 1]),
				jsHelper.variables.assign(removed, jsHelper.constants._true)
			];
			body.push(jsHelper.ifNotNot(persistedEntity, ifIsPersistedEntity));

			body.push(executeSetModel);

			var executeSimulateCall = getExecuteSimulateCall(removed);
			body.push(jsHelper.return(executeSimulateCall));

			return body;
		}

		function getGetByIdFnBody() {
			var entities = 'entities';

			var executeFilterModelById = jsHelper.functions.execute(model + '.filter', byIdFn.functionName).render();

			var entitiesLengthGTZero = jsHelper.compare.gt(entities + '.length', 0).render();
			var entitiesFirst = jsHelper.arrays.elementAt(entities, 0).render();
			var entitiesFirstOrDefault = jsHelper.iif(entitiesLengthGTZero, entitiesFirst, jsHelper.constants.emptyObject).render();
			return [
				jsHelper.variables.declare(entities, executeFilterModelById),
				jsHelper.return(entitiesFirstOrDefault)
			];
		}

		function getInsertFnBody() {
			return [jsHelper.functions.execute(model + '.push', data)];
		}

		function getUpdateFnBody() {
			var indexOfEntity = 'indexOfEntity';
			return [
				jsHelper.variables.declare(entity, getExecuteGetById(dataId)),
				jsHelper.ifNot(entity, jsHelper.return(jsHelper.constants._false)),
				jsHelper.variables.declare(indexOfEntity, jsHelper.arrays.indexOf(model, entity).render()),
				jsHelper.variables.assign(jsHelper.arrays.elementAt(model, indexOfEntity).render(), data),
				jsHelper.return(jsHelper.constants._true)
			];
		}

		function getGetModelFnBody() {
			var executeLocalStorageGet = jsHelper.variables.defaultValue(
				jsHelper.functions.execute(localStorageService + '.get', executeGetKey).render(),
				jsHelper.constants.emptyArray).render();

			return [jsHelper.return(executeLocalStorageGet)];
		}

		function getSetModelFnBody() {
			var modelOrDefault = jsHelper.variables.defaultValue(model, jsHelper.constants.emptyArray).render();
			var executeLocalStorageSet = jsHelper.functions.execute(localStorageService + '.set', [executeGetKey, modelOrDefault]);
			return [executeLocalStorageSet];
		}

		function getGetKeyFnBody() {
			return jsHelper.return(entityType + " + 'List'");
		}

		function getGenerateIdFnBody() {
			var ids = 'ids';
			var forIndex = 'e';

			var forLoopCode = [
				jsHelper.variables.declare(entity, jsHelper.arrays.elementAt(model, forIndex).render()),
				jsHelper.functions.execute(ids + '.push', entityId)
			];

			return [
				declareModelFromGetModel,
				jsHelper.variables.declare(ids, jsHelper.arrays.value(0).render()),
				jsHelper.loops.forVarIn(forIndex, model, forLoopCode), // not [].forEach() because iterating {}
				jsHelper.return(jsHelper.functions.execute('Math.max.apply', [jsHelper.constants._null, ids]).render() + ' + 1')
			];
		}

		function getSimulateCallFnBody() {
			var deferred = 'deferred';
			return [
				jsHelper.variables.declare(deferred, jsHelper.functions.execute($q + '.defer').render()),
				jsHelper.functions.execute(deferred + '.resolve', response),
				jsHelper.return(deferred + '.promise')
			];
		}

		return dis;
	});
