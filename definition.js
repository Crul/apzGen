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
		var servicesSeed = {
			path: 'seedwork/services/',
			features: {
				context: 'context.js',
				notifier: 'notifier.js',
				dataservice: 'dataservice.js'
			}
		};
		var iudFeatures = { featureType: 'iud', features: model };

		var apzDefinition = apzDefinitionHelper.create()
			.setTitle('generated apz')
			.addLibs(['jquery', 'bootstrap'])
			.addEngines('angularjs')
			.addSeeds(libSeed)
			.addSeeds(servicesSeed)
			.addFeatures('menu')
			.addFeatures(iudFeatures);

		apzDefinition.definition.angularjs = {
			notifier: 'notifier',
			dataservice: 'dataservice'
		};

		return apzDefinition.definition;
	});