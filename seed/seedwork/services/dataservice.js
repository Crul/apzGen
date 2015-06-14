function dataservice($q, localStorageService) {
	var dis = {};
	dis.getAll = getAll;
	function getAll(entityType) {
		return simulateCall((getModel(entityType) || []));
	}
	dis.get = getEntity;
	function getEntity(entityType, id) {
		var model = getModel(entityType);
		return simulateCall(getById(model, id));
	}
	dis.set = setEntity;
	function setEntity(entityType, data) {
		var model = getModel(entityType);
		var updated = false;
		if (data.id) {
			updated = update(model, data);
		} else {
			data.id = generateId(entityType);
		}
		if (!updated) {
			insert(model, data);
		}
		setModel(entityType, model);
		return simulateCall(model[data.id]);
	}
	dis.remove = removeEntity;
	function removeEntity(entityType, id) {
		var model = getModel(entityType);
		var persistedEntity = getById(model, id);
		var removed = false;
		if (!!persistedEntity) {
			var indexOfEntity = model.indexOf(persistedEntity);
			model.splice(indexOfEntity, 1);
			removed = true;
		}
		setModel(entityType, model);
		return simulateCall(removed);
	}
	function getById(model, id) {
		var entities = model.filter(_byId);
		return (entities.length > 0 ? entities[0] : {});
		function _byId(entity) {
			return entity.id == id;
		}
	}
	function insert(model, data) {
		model.push(data);
	}
	function update(model, data) {
		var entity = getById(model, data.id);
		if (!entity) {
			return false;
		}
		var indexOfEntity = model.indexOf(entity);
		model[indexOfEntity] = data;
		return true;
	}
	function getModel(entityType) {
		return (localStorageService.get(getKey(entityType)) || []);
	}
	function setModel(entityType, model) {
		localStorageService.set(getKey(entityType),(model || []));
	}
	function getKey(entityType) {
		return entityType + 'List';
	}
	function generateId(entityType) {
		var model = getModel(entityType);
		var ids = [0];
		for (var e in model) {
			var entity = model[e];
			ids.push(entity.id);
		}
		return Math.max.apply(null, ids) + 1;
	}
	function simulateCall(response) {
		var deferred = $q.defer();
		deferred.resolve(response);
		return deferred.promise;
	}
	return dis;
}