define([], function(){	
	var model = {
		tenant: ['name','description','contact']	
	};
	
	var appDefinition = { 
		title: 'apzGenerated',
		libs: ['bootstrap'],
		engines: [ 'angularJs', 'localStorage' ]
	};
	
	appDefinition.angularjs = {
		factories: [ // TODO path.readAllFiles('seedwork', [ 'services', 'controllers' ]);
			'seedwork/services/context.js',
			'seedwork/controllers/baseCtrlInitializer.js',
			'seedwork/controllers/listCtrlInitializer.js',
			'seedwork/controllers/iudCtrlInitializer.js'
		]
		// TODO:, directives: path.readAllFiles('directives');
	};
	
	appDefinition.features = {
		dataservice: 'localStorage',
		menu: true,
		tenant: { factory: 'iud', model: model.tenant }
	};
	
	// TODO define execution strategies [ direct, command ]
	
	return appDefinition;
});