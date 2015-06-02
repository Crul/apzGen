define([], function () {
	var model = {
		tenant: ['name', 'description', 'contact'],
		user: [
			'name', 
			{ fieldName: 'login', label: 'username'},  
			'password', 
			{ fieldName: 'age', fieldType: 'numeric' }]
	};

	var apzDefinition = {
		title: 'generatedApz',
		libs: ['jquery', 'bootstrap'],
		engines: ['angularJs']
	};
	
	apzDefinition.features = {
		menu: true,
		tenant: { factory: 'iud', model: model.tenant },
		user: { factory: 'iud', model: model.user }
	};
	
	// TODO define execution strategies [ direct, command ]
	
	return apzDefinition;
});