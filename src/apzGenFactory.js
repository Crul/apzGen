// TODO convert "features/xxx" to "features/xxxFactory"
// TODO ... and move "xxx.createFiles"" to "xxxFactory.createFiles" 
//		var appFactory = featureFactoryResolver.resolve(appDefinition);
//		var app = appFactory.create(appDefinition, features, featureFiles);
//		var appFiles = appFactory.createFiles(app);
//		... same with featureFactory
define([
		'src/system/fileWriter',
		'src/system/definitionInitializer',
		'src/featureResolver'
	],
	function (fileWriter, definitionInitializer, featureResolver) {
		var dis = {};
		dis.create = create;
		
		function create(appDefinition) {
			appDefinition = initDefinitions(appDefinition);
			
			var features = createFeatures(appDefinition);
			var featureFiles = createFeatureFiles(features).slice(0);
			
			var app = createFeature(appDefinition, features, featureFiles);
			var appFiles = app.createFiles(features, featureFiles);
			
			featureFiles.concat(appFiles).forEach(writeFile);
		}
		
		function initDefinitions(appDefinition) {
			appDefinition = definitionInitializer.init(appDefinition, 'app');
			var definitions = appDefinition.features;
			for (var name in definitions) // not .map() because iterating obj { }
				definitions[name] = definitionInitializer.init(definitions[name], name);
			return appDefinition;
		}
		
		function createFeatures(appDefinition){
			var features = [];
			var definitions = appDefinition.features;
			for (var name in definitions) { // not .map() because iterating obj { }
				var definition = definitions[name];
				var feature = createFeature(definition, appDefinition);
				features.push(feature);
			}
			return features;
		}
		
		function createFeature(definition, p1, p2){
			return featureResolver.resolve(definition).create(definition, p1, p2);
		}
		
		function createFeatureFiles(features){
			var featuresFiles = [];
			for (var f in features) // not features.map() because [].concat([])
				featuresFiles = featuresFiles.concat(features[f].createFiles());
			return featuresFiles;
		}
		
		function writeFile(file) {
			var path = (file.path ? file.path + '/' : '');
			fileWriter.write('bin/' + path, file.name, file.content);
		}
		
		return dis;
	});