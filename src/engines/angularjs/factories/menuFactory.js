define(['src/fileDefinitionFactory', 'src/factoryResolver'], 
	function (fileDefinitionFactory, factoryResolver){
		var dis = {};
		dis.create = create;
		var excludeOptions = ['menu'];
		
		function create(definition, appDefinition){
			var menu = require('util')._extend({}, definition);
			
			menu.model = menu.model || {};
			menu.model.areas = createAreas(menu, appDefinition);			  
			menu.fileDefinitions = fileDefinitionFactory.create(menu, [
				{ fileType: 'class', name: menu.name },
				{ fileType: 'view', name: menu.name },
			]);
			
			return menu;
		}
		
		function createAreas(definition, appDefinition){
			if (definition.areas) return definition.areas;
			if (definition.options) return [ definition ];
			if (Array.isArray(definition)) return definition;
			return [{ options: createOptions(appDefinition.features) }];
		}
		
		function createOptions(features){
			var options = [];
			for (var f in features) // not [].map() because iterating obj {}
				options = options.concat(createOptionsFromFeature(features[f]));
				
			return options;
		}
		
		function createOptionsFromFeature(feature){
			if (excludeOptions.indexOf(feature.name) >= 0) return [];
			
			var factory = factoryResolver.resolve(feature);
			if (factory && factory.createMenuOptions)
				return factory.createMenuOptions(feature);
							
			return [{ path: feature.name, name: feature.name }];
		}
		
		return dis;
	});