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
			.addLibs(['jquery', 'bootstrap'])
			.addEngines('angularjs')
			.addSeeds('lib', libSeed)
			.addFeatures('menu')
			.addFeatures(iudFeatures);

		return apzDefinition.definition;
	});