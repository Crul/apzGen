### apzGen
Node.js application generator. A non-ambitious project just for fun.
For now, only foo angularjs+bootstrap+(soon)kendoui arquitecture.

# node_modules required
- requirejs
- [optional] express (for hosting the generated app)

### how it works
- apzGen generates the application files from definition:
  - app properties: title, engines, third party libs dependencies
  - features: the core of apzGen
  - models: entities and their fields
  - particular engine configuration (angularjs)
  - (coming soon) views
- apzGen copies all files in seed folder to the generated app

## application definition structure
edit definition.js to change the configuration:
```
define([], function(){	
	var model = {
		tenant: ['name']	
	};
	
	var appDefinition = { 
		title: 'generatedApz',
		libs: ['bootstrap'], // see supported libs in src/render/view/html/libResolver.js
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

## generating code
```
  node _run
```
## running web server
```
  node webServer
```
now you should see the application in http://localhost/app.html

### detailed process
apzGen is everything about features.
features are organized by engines.
factories create features.
features create apzFiles.
apzFiles are rendered by renderers and exported to files.

so, if you want to add a feature (e.g.: myNewFeature in myNewEngine) you have to:
1	add a new engine and a new feature in the definition file:
	```
		appDefinition = {
			(...),
			engines: [(...), 'myNewEngine']
		};
		(...)
		appDefinition.features = {
			(...),
			myNewFeature: { ... }
		};
	```

2	write a factory that creates the feature
	save it in src/engines/myNewEngine/factories
	it has to implement a create function that:
		- receives as a parameter the object from appDefinition.features.myNewFeature
		- uses src/apzFileFactory to create the apzFiles, as many as files you want to create.
	 	- returns the feature with an apzFiles property (with the apzFiles of course) and all the data you want to use in the renderization
		 
	the properties of apzFiles are:
		- path: where the file will be created
		- name: file name, without extension
		- fileType: 'class' or 'view', the extension should be generated from this
		- renderer: if your render follows naming convention it can be empty
		- feature: in order to be accesible in the renderer

3	write as many renderers as file types you want to render
 	if you want to render one js controller and one html view, then you have to write:
	  	- a myNewFeatureRenderer in src/engines/myNewEngine/render/class
	  	- a myNewFeatureRenderer in src/engines/myNewEngine/render/view
	  
	they have to implement a render function that:
	  	- receives as a parameter each apzFile you have created in the factory
		- returns the content of the file

for renderization you can use the following components:
	- in src/default/render/:
		- appRenderer: to render default application
		- classRenderer: to render default class application
		- viewRenderer: ro render default view appliction. viewRenderer uses layoutRenderer to render elements
		- layoutRenderer: to render default view elements (see file for api). layoutRenderer uses formRenderer to render form elements
		- formRenderer: to render form elements (see file for api)
	- menuRenderer (in src/default/render/class and src/default/render/view): to render menu elements
	- in src/engines/angularjs:
		// TODO  
	- in src/render/class/js:
		// TODO  
	- in src/render/view/html:
		// TODO  
	- in src/render/view/kendo:
		// TODO by default
	- in src/render/view/bootstrap:
		// TODO by default

you can also edit those files to change the default behaivor in renderization

// TODO file extensions 

there is some advanced stuff about interaction between features, like:
- implementing a getMenuOptions(feature) function in the featureFactory to add options in the menu 
- setting a controllers[] property in the feature to add controllers (angularjs)
- setting a routes[] property in the feature to add routes (angularjs)