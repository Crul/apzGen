define(['src/fileDefinitionFactory'], 
	function (fileDefinitionFactory){
		var dis = {};
		dis.create = create;
		dis.createRoutes = createRoutes; // TODO ¿ move from factory to feature ?
		dis.createControllers = createControllers; // TODO ¿ move from factory to feature ?
		dis.createMenuOptions = createMenuOptions; // TODO ¿ move from factory to feature ?
		
		function create(definition){
			var iud = require('util')._extend({}, definition);			
			initialize(iud);
			
			var fileDefintionTemplate = { path: iud.name };
			var fileDefinitions = [
				{ fileType: 'class', name: iud.name },
				{ fileType: 'view', name: iud.name },
				{ fileType: 'class', renderer: 'list', name: iud.name + 'List' },
				{ fileType: 'view', renderer: 'list', name: iud.name + '-list' }
			];
			iud.fileDefinitions = fileDefinitionFactory.create(iud, fileDefinitions, fileDefintionTemplate);
			return iud;
		}
			
		function createRoutes(definition){
			var name = definition.name;
			return [{
					path: '/' + name + '/list',
					template: name + '/' + name + '-list',
					controller: name + 'List'
				},{
					path: '/' + name + '/edit/:id',
					template: name + '/' + name,
					controller: name
				}];
		}
		
		function createControllers(feature){
			var name = feature.name;
			return [ name, name + 'List' ];
		}
		
		function createMenuOptions(feature){
			return [
				{ path: feature.name + '/list', name: feature.name + ' list' },
				{ path: feature.name + '/edit/new', name: 'new ' + feature.name  }
			];
		}
		
		function initialize(definition){
			definition.model = definition.model || []; 
			if (Array.isArray(definition.model))
				definition.model = {
					fields: definition.model
				};
		}
		
		return dis;
	});