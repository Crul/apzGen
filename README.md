# apzGen
Node.js application generator. A non-ambitious project just for fun.
For now, only foo angularjs+bootstrap+(soon)kendoui arquitecture.

### node_modules required:
- require.js
- [optional] express (for host the generate app)

## process
- apzGen copies all files in seed folder to the generated app
- apzGen generates the application files from definition:
  - app properties: title, third party libs dependencies
  - models: entities, fields and their configuration
  - controllers: based on seed initializer classes (should be better inheritance)
  - (coming soon) views
  - particular implementation

## generating code
```
  node _run
```

### running web server
```
  node webServer
```

## application definition structure
file: definition.js
```

define([], function(){	
	var model = {
		tenant: ['name']	
	};
	
	var appDefinition = { 
		title: 'apzGenerated',
		libs: ['bootstrap'], // see supported libs in src/engines/html/libResolver.js
		engine: 'angularJs' // only angularJs supported, more can be added in src/engines
	};
	
	appDefinition.angularjs = {
		factories: [
			'seedwork/services/context.js',
			'seedwork/controllers/baseCtrlInitializer.js',
			'seedwork/controllers/listCtrlInitializer.js',
			'seedwork/controllers/iudCtrlInitializer.js'
		]
	};
	
	appDefinition.features = {
		menu: true,
		tenant: { factory: 'iud', model: model.tenant }
	};
	
	return appDefinition;
});
```
