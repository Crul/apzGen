# apzGen
Node.js application generator. A non-ambitious project just for fun.

For now, only foo angularjs+kendoui+bootstrap arquitecture.

## node_modules required
- requirejs
- [optional] express (for hosting the generated app)

## how it works
apzGen generates the application files from definition:
- app properties: title, engines, third party libs dependencies
- features: the core of apzGen
- particular engine configuration (angularjs)

## generating code
```
  node _run.js
```
## running web server
you can change the port in webserver.js file
```
  node webServer.js
```
now you should see the application in http://localhost/

## application definition structure
edit definition.js to change the configuration
```
define(['src/apzDefinitionHelper'],
	function (apzDefinitionHelper) {

		var model = {
			tenant: {
				fields: ['name', 'description', 'contact']
			},
			user: {
				fields: [
					'name',
					{ fieldName: 'login', label: 'username' },
					'password',
					{ fieldName: 'age', fieldType: 'numeric' }
				]
			}
		};

		var libSeed = 'lib/*.*';
		var iudFeatures = { featureType: 'iud', features: model };

		var apzDefinition = apzDefinitionHelper.create()
			.setTitle('generated apz')
			.addLibs(['jquery', 'bootstrap'])
			.addEngines('angularjs')
			.addSeeds(libSeed)
			.addFeatures('menu')
			.addFeatures(iudFeatures);

		return apzDefinition.definition;
	});
```

## detailed process
- apzGen is everything about features
- features are organized in engines
- featureFactories create features
- features create apzFile specifications
- apzFiles are rendered by fileRenderers and written in files

each implemented feature provides a specific functionality:
- angularjs\app: app features are special features; angularjs feature generates:
	- app.js file with the angularjs bootstrapping 
	- index.html file with the file includes and html code for angularjs
- seedFeature copies a file or a folder to output path
- menuFeature reads menu options from other features and generates: 
	- menu angularjs controller 
	- menu angularjs view
- iudFeature: reads fields definition from model info and generates:
	- list angularjs controller
	- list angularjs view 
	- iud (crud) angularjs controller 
	- iud (crud) angularjs view

features support dependencies: 
- set a dependentFeatures[] property in any feature and apzGen will create them for you
- this allows to maintain the initial definition clean and distributes the dependency tree through the features

## adding new features
if you want to add a feature (e.g.: myNewFeature in myNewEngine) you have to:

1. define a new engine
	- add a new engine and a new feature in the definition file:
	```
	var apzDefinition = apzDefinitionHelper.create()
		(...)
		.addEngines([(...), 'myNewEngine'])
		(...)
		.addFeatures({ featureType: 'myNewFeature', (...) });
	```

2. create the Factory 
	- write a factory that creates the feature
	- save it in src/engines/myNewEngine/factories
	- it has to implement a function create() that:
		- receives as parameter the object you passed to apzDefinitionHelper.create().addFeatures({ ... })
		- returns the feature with:
			- all the data you want to use in the renderer
			- an apzFiles[] property with the apzFiles you want to generate, the apzFile properties are:
				- path: (optional) where the file will be created
				- fileName: file name, without extension
				- fileType: ('class', 'view', 'seed') if 'class' or 'view', file extension will be inferred from base renderers
				- renderer: (optional) if your render follows naming convention it can be empty

3. write as many renderers as file types you want to render
	- if you want to render one js file and one html view, then you have to write:
		- a myNewFeatureRenderer in src/engines/myNewEngine/render/class
		- a myNewFeatureRenderer in src/engines/myNewEngine/render/view
	
	- they have to implement a render function that:
		- receives as a parameter each apzFile you have created in the factory
		- returns the content of the file
	
	- for renderization you can use the following components:
		- in src/default/render/:
			- appRenderer: to render default application
			- classRenderer: to render default class application
			- viewRenderer: ro render default view appliction, viewRenderer uses layoutRenderer to render elements
			- layoutRenderer: to render default view elements (see file for api), layoutRenderer uses formRenderer to render form elements
			- formRenderer: to render form elements (see file for api)
		- menuRenderer (in src/default/render/class and src/default/render/view): to render menu elements
		- in src/engines/angularjs: all the angularjs related stuff is here:
			- factories: for angularjs app, menu and iud features
			- render: 
				- class and view renderers for angularjs app, menu and iu features
				- html and kendo renderers for overwrite default html functionality
		- in src/render/class/js: simple renderers for javascript files and functions
		- in src/render/view/html: renderers for html files with a lot of functionality, you can overwrite them as src/render/view/bootstrap does
		- in src/render/view/bootstrap: renderer for html files, overwritting default html functionality
	
	- you can also edit those files to change the default behaivor in renderization

### angularjs features
there is some advanced stuff about interaction between angular features, like:
- setting a feaure.angularjs.menuOptions[] property in any feature to add options to the menu 
- setting a feaure.angularjs.factories[] property in any feature to add factories 
- setting a feaure.angularjs.controllers[] property in any feature to add controllers
- setting a feaure.angularjs.routes[] property in any feature to add routes
