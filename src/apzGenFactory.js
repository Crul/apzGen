define([
		'src/system/appContext',
		'src/system/fileWriter',
		'src/system/definitionInitializer',
		'src/factoryResolver',
		'src/rendererResolver'
	],
	function (appContext, fileWriter, definitionInitializer, factoryResolver, rendererResolver) {
		var dis = {};
		dis.copySeed = copySeed;
		dis.create = create;
		
		function create(appDefinition) {
			appDefinition = initialize(appDefinition);
			var features = createFeatures(appDefinition, appDefinition.features);
			var featureFileDefinitions = createFileDefinitions(features).slice(0);
			var app = factoryResolver.resolve(appDefinition)
				.create(appDefinition, features, featureFileDefinitions);
			
			renderFiles(app.fileDefinitions).forEach(writeFile);
		}
		
		function initialize(appDefinition) {
			appContext.engine = appDefinition.engine || 'angularjs';
			appDefinition = definitionInitializer.init(appDefinition, 'app');
			var featureDefinitions = appDefinition.features;
			for (var name in featureDefinitions) // not [].map() because iterating obj {}
				featureDefinitions[name] = definitionInitializer.init(featureDefinitions[name], name);

			return appDefinition;
		}
		
		function createFeatures(appDefinition, featureDefinitions){
			var features = [];
			for (var name in featureDefinitions) { // not [].map() because iterating obj {}
				var definition = featureDefinitions[name];
				var feature = factoryResolver.resolve(definition)
					.create(definition, appDefinition);
				
				features.push(feature);
			}
			return features;
		}
		
		function createFileDefinitions(features){
			var featuresFileDefinitions = [];
			features.forEach(function(feature){
				featuresFileDefinitions = featuresFileDefinitions.concat(feature.fileDefinitions);
			});
			return featuresFileDefinitions;
		}
				
		function renderFiles(fileDefinitions){
			return fileDefinitions.map(function(fileDefinition){
				var renderer = rendererResolver.resolve(fileDefinition);
				fileDefinition.content = renderer.render(fileDefinition.feature); 
				return fileDefinition;
			});
		}
		
		function writeFile(file) {
			var path = (file.path ? file.path + '/' : '');
			fileWriter.write('bin/' + path, file.name, file.content);
		}
		
		function copySeed(){
			fileWriter.copyFolder('seed', 'bin');
		}
		
		return dis;
	});