// TODO: Extract code
define([], 
	function (){
		var fileFactory = require('src/fileFactory');
		var path = require('src/system/path');
		var dis = {};
		dis.create = create;
		
		var requiredLibs = [ 'jquery', 'angularjs', 'angularjs.route' ];
		
		function create(definition, features, featuresFiles){
			addRequiredLibs(definition);
			definition.path = '';
			definition.angularjs = definition.angularjs || {};
			definition.angularjs.factories = getFactories(definition.angularjs.factories);			 
			definition.angularjs.controllers = getControllers(definition.features);
			definition.angularjs.routes = getRoutes(features);
			definition.angularjs.dependencies = [ 'ngRoute' ];
			
			definition.files = (definition.files || [])
				.concat(definition.angularjs.factories)
				.concat(featuresFiles || []);
				
			definition.createFiles = createFiles;
			return definition;
		}
		
		function createFiles(features, featuresFiles){
			var appFile = createApp(this);
			this.files.push(appFile);
			return [ 
				appFile, 
				createView(this)
			];
		}
		
		function getFactories(factories){
			return (factories || []).map(function(factory){
				return path.getFileInfo(factory);
			});
		}
		
		function getControllers(features){
			var controllers = [];
			for (var f in features){
				var feature = features[f];
				if (feature.base){
					var baseFeature = require('src/features/' + feature.base);
					var featureControllers = baseFeature.createControllers(feature);
					controllers = controllers.concat(featureControllers);
				} else { 
					controllers.push(feature.name);
				}
			}
			return controllers;
		}
		
		function getRoutes(features){
			var routes = [];
			features.forEach(function(feature){ 
				routes = routes.concat(createRoutes(feature.definition));
			});
			return routes;
		}
		
		function createRoutes(definition){			
			var name = definition.name;
			if (definition.base){
				var baseFeature = require('src/features/' + definition.base);
				return baseFeature.createRoutes(definition);
			}
			return [{
				path: '/' + name,
				template: name + '/' + name,
				controller: name
			}];
		}
		
		function createApp(definition){
			return fileFactory.createClass(definition, 'js/angularjs/app');
		}
		
		function createView(definition){
			return fileFactory.createView(definition, 'html/angularjs/angularjsPage');
		}
		
		function addRequiredLibs(definition){
			definition.libs = definition.libs || [];
			var libs = [];
			for (var l in requiredLibs){
				var lib = requiredLibs[l];
				if (definition.libs.indexOf(lib) < 0)
					libs.push(lib);
			}
			definition.libs = libs.concat(definition.libs);
		}
		
		return dis;
	});