define(['src/system/fsService'],
	function (fsService) {
		var definition = {
			title: 'generated apz',
			engines: ['seed', 'angularjs']
		};

		var model = JSON.parse(fsService.readFile('definition-model.json'))
		definition.features = [
			{ seed: { lib: 'lib/*.*' } },
			'services/dataservice',
			'services/logger',
			'menu',
			{ iud: model }
		];

		return definition;
	});