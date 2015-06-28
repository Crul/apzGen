define(['src/core/apzDefinitionFactory', 'src/core/apzFactory', 'src/core/apzRenderer', 'src/core/apzWritter'],
	function (apzDefinitionFactory, apzFactory, apzRenderer, apzWritter) {
		var dis = {};
		dis.generate = generate;

		var outputPath = 'bin';
		function generate() {
			var apzDefinition = apzDefinitionFactory.create();
			var apz = apzFactory.create(apzDefinition);
			var apzFiles = apzRenderer.render(apz);
			apzWritter.write(apzFiles, outputPath);
		}

		return dis;
	});