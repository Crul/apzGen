define(['src/core/apzDefinitionHelper', 'src/system/fsService'],
	function (apzDefinitionHelper, fsService) {

		var libSeed = 'lib/*.*';
		var model = JSON.parse(fsService.readFile('definition-model.json'));
		var iudFeatures = { featureType: 'iud', features: model };

		var apzDefinition = apzDefinitionHelper.create()
			.setTitle('generated apz')
		// TODO .app('angularjs') and remove from engines?
			.addLibs(['jquery'])
			.addEngines(['seed', 'angularjs'])
			.addSeeds('lib', libSeed) // TODO remove apzDefinitionHelper.addSeeds
			.addFeatures('services/dataservice')
			.addFeatures('services/logger')
			.addFeatures('menu')
			.addFeatures(iudFeatures);

		return apzDefinition.definition;
	});