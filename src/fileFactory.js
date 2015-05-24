define(['src/system/definitionInitializer'], 
	function fileFactory(definitionInitializer){
		var dis = {};
		dis.create = create;
		dis.createClass = createClass;
		dis.createView = createView;
		
		function create(path, name, content){
			return {
				path: path,
				name: name,
				content: content
			};
		}
		
		function createClass(definition, classRendererName){
			definition = definitionInitializer.init(definition);
			return createFile(definition, classRendererName, 'class');
		}
		
		function createView(definition, viewRendererName){
			return createFile(definition, viewRendererName, 'view');
		}
		
		function createFile(definition, rendererName, defaultRendererName){
			var rendererPath = 'src/render/' + (rendererName || defaultRendererName) + 'Renderer';
			var renderer = require(rendererPath);
			var path = getProperty(definition, 'path');
			var filename = getProperty(definition, 'filename');
			filename = renderer.getFilename(filename);
			var content = renderer.render(definition);			
			return create(path, filename, content);
		}
		
		function getProperty(definition, property){
			var elementName = definition.name;
			return (definition[property] === undefined ? elementName : definition[property]);
		}
		
		return dis;
	});