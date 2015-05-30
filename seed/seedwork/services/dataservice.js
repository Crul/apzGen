function dataservice($q, localStorageService) {
	var dis = {};

	dis.getAll = getAll;
	dis.get = get;
	dis.set = set;
	dis.remove = remove;

	function getAll(entityType) {
		return simulateCall(getModel(entityType) || []);
	}

	function get(entityType, id) {
		return simulateCall(getById(entityType, id));
	}
	
	function set(entityType, data) {
		var updated = false;
		var model = getModel(entityType);

		if (!isNew(data))
			updated = update(entityType, model, data);

		if (!updated)
			insert(entityType, model, data);

		setModel(entityType, model);
		return simulateCall(model[data.id]);
	}

	function getById(entityType, id, model){
		model = model || getModel(entityType);
		var entities = model.filter(byId(id));
		return entities.length > 0 ? entities[0] : {};
	}

	function byId(id) {
		return function (entity) {
			return entity.id == id;
		};
	}
	
	function isNew(data) {
		return !data.id;
	}

	function insert(entityType, model, data) {
		data.id = generateId(entityType);
		model.push(data);
	}

	function update(entityType, model, data) {
		var entity = getById(entityType, data.id, model);
		if (!entity) return false;

		var indexOfEntity = model.indexOf(entity);
		model[indexOfEntity] = data;
		return true;
	}

	function remove(entityType, id) {
		var model = getModel(entityType);
		var persistedEntity = getById(entityType, id, model);
		var removed = false;
		if (!!persistedEntity) {
			var indexOfEntity = model.indexOf(persistedEntity);
			model.splice(indexOfEntity, 1);
			removed = true;
		}
		setModel(entityType, model);
		return simulateCall(removed);
	}


	function simulateCall(response) {
		var deferred = $q.defer();
		deferred.resolve(response);
		return deferred.promise;
	}

	function getModel(entityType) {
		var key = entityType + 'List';
		var model = localStorageService.get(key);
		if (!model) localStorageService.set(key, {});
		return model || localStorageService.get(key);
	}

	function getModel(entityType) {
		return localStorageService.get(getKey(entityType)) || [];
	}

	function setModel(entityType, model) {
		localStorageService.set(getKey(entityType), model || []);
	}

	function getKey(entityType) {
		return entityType + 'List';
	}

	function generateId(entityType) {
		var model = getModel(entityType);
		var ids = [0]; // 0 for empty models
		for (var e in model) { // not [].forEach() because iterating {}
			var entity = model[e];
			ids.push(entity.id);
		}
		return Math.max.apply(null, ids) + 1;
	}

	return dis;
}