# apzGen
Node.js application generator. A non-ambitious project just for fun.

For now, only foo angularjs+kendoui+bootstrap arquitecture.

## node_modules required
- requirejs
- DOMBuilder - https://github.com/insin/DOMBuilder
- esprima - https://github.com/jquery/esprima
- escodegen - https://github.com/estools/escodegen
- html - https://github.com/maxogden/commonjs-html-prettyprinter
- [optional] express (for hosting the generated app)

## how it works
apzGen generates the (final or schaffolding) application files from definition:
- title
- third party libs (e.g.: jquery, bootstrap)
- engines: libraries with featureFactories and featureRenderers (e.g.: angularjs)
- feature definitions (e.g.: menu, iud/crud features)

## running
```
  node _run.js
```
#### running web server
```
  node webServer.js
```
now you should see the application in http://localhost/

you can change the port in webserver.js file

## application definition structure
edit definition.js to change the configuration, in definition-model.json you can edit the properties of the entities in the model
```
define(['src/core/apzDefinitionHelper', 'src/system/fsService'],
	function (apzDefinitionHelper, fsService) {

		var libSeed = 'lib/*.*';
		var model = JSON.parse(fsService.readFile('definition-model.json'));
		var iudFeatures = { featureType: 'iud', features: model };

		var apzDefinition = apzDefinitionHelper.create()
			.setTitle('generated apz')
			.addLibs(['jquery'])
			.addEngines(['seed', 'angularjs'])
			.addSeeds('lib', libSeed)
			.addFeatures('services/dataservice')
			.addFeatures('services/logger')
			.addFeatures('menu')
			.addFeatures(iudFeatures);

		return apzDefinition.definition;
	});
```

## detailed process
- apzGen is everything about features (and aspects)
- features are organized in engines
- features are created by featureFactories
- features create apzFiles
- features can add aspects to pipeline
- aspects intercept (modify) apzFiles
- apzFiles are built (by DOMBuilder, escodegen) and written in files

each implemented feature provides a specific functionality:
- angularjs\app: app features are special features; angularjs feature generates:
	- app.js file with the angularjs bootstrapping 
	- index.html file with the html includes and html code for angularjs
- seedFeature copies a file or a folder to output path, aspects are applied to seed files
- menuFeature reads menu options from other features and generates: 
	- menu angularjs controller
	- menu angularjs view
- iudFeature: reads field definitions from model info and generates:
	- list angularjs controller
	- list angularjs view 
	- iud (crud) angularjs controller 
	- iud (crud) angularjs view

features support dependencies: 
- set a dependentFeatures[] property in any feature and apzGen will create them for you
- this allows to maintain the initial definition clean and distributes the dependency tree through the features

### apzFiles
each azFile is the seed for a final real file, its properties are:
- filePath: full file path
- getDefinition: it should return a valid file definition for its type, supported types:
	- html: returned value will be passed as param to DOMBuilder.build() function
	- js: returned value will be passed as param to escodegen.generate() function, you can use esprima to get the definition of any js code

### aspects
the power of apzGen (if there is any power) comes from the aspects, objects with:
- property aspectName: used to avoid duplicates in the pipeline
- applyTo(filePath) function: return true if aspect applies to file path, ussually based on extension
- intercept(code) function: 
	- receives the code of a full file
	- should return the same code but with modifications
	- ussualy calls its codeTransform.nodeVisitior(node, [processNodeFns]) function to visit all the nodes in the code
	- look at apzFiles for definition formats

this modifications are the key of aspects in apzGen, they provide the oportunity to add features to every file in the app, e.g.: 
- loogerJsAspect: adds angularjs $log dependency in all angularjs factories and adds a $log.log('exeuting {functionName}') call in every private function
- angularjsHtmlAspect: changes html attributes to angularjs attributes ('click' to 'ng-click', 'value' to 'ng-model')
- kendoHtmlAspect: adds kendoui html attributes to html tags 
- bootstrapHmlAspect: adds bootstrap css classes to html tags 

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
			- an apzFiles[] property with the apzFiles you want to generate

### angularjs features
there is some advanced stuff about interaction between angular features, like:
- setting a feaure.angularjs.menuOptions[] property in any feature to add options to the menu 
- setting a feaure.angularjs.factories[] property in any feature to add factories 
- setting a feaure.angularjs.controllers[] property in any feature to add controllers
- setting a feaure.angularjs.routes[] property in any feature to add routes
