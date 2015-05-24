define([], function(){
	var appDefinition = { 
		title: 'apzGenerated',
		libs: ['bootstrap']
	};
	
	appDefinition.angularjs = {
		factories: [
			'seedwork/controllers/listCtrlInitializer.js',
			'seedwork/controllers/iudCtrlInitializer.js'
		]
		// TODO:, services: [ 'context' ]
	};
	
	var model = {
		tenant: ['name']	
	};
	
	appDefinition.features = {
		menu: true,
		tenant: { base: 'iud', model: model.tenant }
	};
	
	// TODO define data access
	
	// TODO define execution strategies [ direct, command ]
	
	return appDefinition;
});