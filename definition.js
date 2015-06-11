define(['src/apzDefinitionHelper'],
	function (apzDefinitionHelper) {

		var model = { // TODO move to .json file
			tenant: {
				fields: ['name', 'description', 'contact']
			},
			user: {
				fields: [
					'name',
					{ fieldName: 'login', label: 'username' },
					'password',
					{ fieldName: 'age', fieldType: 'numeric' }
				]
			}
		};

		var libSeed = 'lib/*.*';
		var iudFeatures = { featureType: 'iud', features: model };

		var apzDefinition = apzDefinitionHelper.create()
			.setTitle('generated apz')
			 // TODO add .app('angularjs') ?
			.addLibs(['jquery'])
			 // TODO remove when featureName == engineName, add convention
			.addEngines(['bootstrap', 'angularjs', 'kendoui'])
			.addSeeds('lib', libSeed)
			.addFeatures('kendoui')
			.addFeatures('services/logger')
			.addFeatures('menu')
			.addFeatures(iudFeatures);

		return apzDefinition.definition;
	});