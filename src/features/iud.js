// TODO: Extract code
define(
	[ 
		'src/fileFactory',
		'src/render/classRenderer',
		'src/render/viewRenderer'
	], 
	function (fileFactory, classRenderer, viewRenderer){
		var dis = {};
		dis.create = create;
		dis.createControllers = createControllers;
		dis.createRoutes = createRoutes;
		dis.createMenuOptions = createMenuOptions;
		
		function create(definition){
			return {
				definition: definition,
				createFiles: createFiles
			};
		}
		
		function createControllers(feature){
			var name = feature.name;
			return [ name, name + 'List' ];
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
		
		function createMenuOptions(feature){
			return [
				{ path: feature.name + '/list', name: feature.name + ' list' },
				{ path: feature.name + '/edit/new', name: 'new ' + feature.name  }
			];
		}
		
		function createFiles(){
			initialize(this.definition);
			var listCtrlDefinition = require('util')._extend({}, this.definition);
			var listViewDefinition = require('util')._extend({}, this.definition);
			var editCtrlDefinition = require('util')._extend({}, this.definition);
			var editViewDefinition = require('util')._extend({}, this.definition);
			return [
				createListController(listCtrlDefinition),
				createListView(listViewDefinition),
				createEditController(editCtrlDefinition),
				createEditView(editViewDefinition)
			];
		}
		
		function initialize(definition){
			definition.model = definition.model || []; 
			if (Array.isArray(definition.model)){
				definition.model = {
					fields: definition.model
				};
			}
		}
		
		function createListController(definition){
			definition.path = definition.name;
			definition.name = definition.name + 'List'; 
			definition.body = classRenderer.renderCtrlInitialization('listCtrlInitializer');
			definition.dependencies = [ 'listCtrlInitializer' ];
			return fileFactory.createClass(definition);
		}
		
		function createListView(definition){
			var name = definition.name;
			definition.path = name;
			definition.filename = name + '-list';
			definition.view = viewRenderer.renderLink('back', '#/'); // TODO back > renderBackLink() { history.back }
			definition.view += viewRenderer.renderLink('new ' + name, '#/' + name + '/edit/new');
			definition.view += viewRenderer.renderTitle(name);
			definition.view += viewRenderer.renderTable(name, definition.model);
			return fileFactory.createView(definition);
		}
		
		function createEditController(definition){
			definition.body = classRenderer.renderCtrlInitialization('iudCtrlInitializer');
			definition.dependencies = [ 'iudCtrlInitializer' ];
			return fileFactory.createClass(definition);
		}
		
		function createEditView(definition){
			definition.model = definition.model || {};
			
			var view = (definition.model.fields || []).map(viewRenderer.renderControl).join('');				
			view += viewRenderer.renderButton('save', 'save()');
			view = viewRenderer.renderForm(view);			
			view = viewRenderer.renderLink('back', '#/' + definition.name + '/list') + view;
			
			definition.path = definition.name;
			definition.filename = definition.name;
			definition.view = view;
			return fileFactory.createView(definition);
		}
		
		return dis;
	});