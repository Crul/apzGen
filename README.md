# apzGen
Node.js application generator. A non-ambitious project just for fun.
For now, only foo angularjs+bootstrap+(soon)kendoui arquitecture.

### node_modules required:
- require.js
- [optional] express (for host the generate app)

## process
- apzGen copies all files in seed folder to the generated app
- apzGen generates the application files from definition:
  - app properties: title, thir party libs dependencies
  - models: entities, fields and their configuration
  - controllers: based on seed base classes
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
	var appDefinition = { 
		title: 'title',
		libs: ['bootstrap'] // see supported libs in src/html/libResolver.js
	};
	
	var model = {
		tenant: ['name']
	};
	
	appDefinition.features = {
		menu: true,
		tenant: { base: 'iud', model: model.tenant }
	};
	
	appDefinition.angularjs = {
		factories: [ // angularJs factories
			'seedwork/controllers/listCtrlInitializer.js',
			'seedwork/controllers/iudCtrlInitializer.js'
		]
	};

	return appDefinition;
});
```
