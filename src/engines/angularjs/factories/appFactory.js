// TODO: Extract code (factories, controllers and routes)
define(
	[
		'src/fileDefinitionFactory', 
		'src/system/path', 
		'src/factoryResolver'
	], 
	function (fileDefinitionFactory, path, factoryResolver){
		var dis = {};
		dis.create = create;
		
		var requiredLibs = [ 'jquery', 'angularjs', 'angularjs.route' ];
		
		function create(definition, features, featuresFileDefinitions){
			var featureDefinitions = definition.features;
			var app = require('util')._extend({}, definition);
			setThirdPartyLibs(app, requiredLibs);
			
			app.path = '';
			app.angularjs = app.angularjs || {};
			app.angularjs.factories = createFactories(app.angularjs.factories);			 
			app.angularjs.controllers = createControllers(featureDefinitions);
			app.angularjs.routes = createRoutes(features);
			app.angularjs.dependencies = [ 'ngRoute' ];
			
			var appFileDefinitions = (app.fileDefinitions || [])
				.concat(featuresFileDefinitions || [])
				.concat([ 
					{ fileType: 'class', path: '', name: 'app' }, 
					{ fileType: 'view', renderer: 'index', path: '', name: 'app' }
				]);
			
			app.fileDefinitions = fileDefinitionFactory.create(app, appFileDefinitions, 'pipas');
			
			return app;
		}
		
		function createFactories(factories){
			return (factories || []).map(function(factory){
				return path.getFileInfo(factory);
			});
		}
		
		function createControllers(featureDefinitions){
			var controllers = [];
			for (var f in featureDefinitions) // not [].forEach because iterating object {}
				controllers = controllers.concat(createFeatureControllers(featureDefinitions[f]));
				
			return controllers;
		}
		
		function createFeatureControllers(featureDefinition){
			var factory = factoryResolver.resolve(featureDefinition);
			if (factory && factory.createControllers)
				return factory.createControllers(featureDefinition);
			
			return featureDefinition.name;
		}
		
		function createRoutes(features){
			var routes = [];
			features.forEach(function(feature){ 
				routes = routes.concat(createFeatureRoutes(feature));
			});
			return routes;
		}
		
		function createFeatureRoutes(feature){
			var factory = factoryResolver.resolve(feature);
			if (factory && factory.createRoutes)
				return factory.createRoutes(feature);
						
			var name = feature.name;
			return [{
				path: '/' + name,
				template: name + '/' + name,
				controller: name
			}];
		}
		
		function setThirdPartyLibs(app, requiredLibs){			
			var libs = requiredLibs.filter(function(requiredLib){ 
				return app.libs.indexOf(requiredLib) < 0;
			});
			app.libs = libs.concat(app.libs || []);
		}
		
		return dis;
	});