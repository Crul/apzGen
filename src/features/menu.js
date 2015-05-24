// TODO: Extract code
define([], function (){	
	var fileFactory = require('src/fileFactory'); 
	var classRenderer = require('src/render/classRenderer');
	var viewRenderer = require('src/render/viewRenderer');

	var dis = {};
	dis.create = create;
	
	function create(definition, appDefinition){
		definition.model = definition.model || {};
		definition.model.areas = getAreas(definition, appDefinition); 
		return {
			definition: definition,
			createFiles: createFiles
		};
	}
	
	function getAreas(definition, appDefinition){
		var areas = definition.areas;
		if (!areas) {
			if (definition.options){ 
				areas = [ definition ];
			}else if (Array.isArray(definition)){
				areas = definition;
			}else{
				areas = [{ options: createOptionsFromFeatures(appDefinition.features) }];
			}
		}
		return areas;
	}
	
	function createOptionsFromFeatures(features){
		var options = [];
		for (var f in features){
			var feature = features[f];
			if (feature.base) {				
				var baseFeature = require('src/features/' + feature.base);
				options = options.concat(baseFeature.createMenuOptions(feature));
			} else if(feature.name !== 'menu') {
				options.push({ path: feature.name, name: feature.name });
			}
		}
		return options;
	}
			
	function createFiles(){
		var classDefinition = require('util')._extend({}, this.definition);
		var viewDefinition = require('util')._extend({}, this.definition);
		return [ 
			createClass(classDefinition),
			createView(viewDefinition)
		];
	}
	
	function createClass(definition){
		definition.body = classRenderer.renderModelInitializacion(definition.model);
		return fileFactory.createClass(definition);
	}
	
	function createView(definition){
		var view = viewRenderer.renderMenu();
		definition.path = definition.name;
		definition.filename = definition.name;
		definition.view = view;
		
		return fileFactory.createView(definition);
	}
	
	return dis;
});