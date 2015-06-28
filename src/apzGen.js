define(['definition', 'src/core/apzFactory', 'src/core/apzDefinitionFactory', 'src/core/apzRenderer', 'src/core/apzWritter'],
	function (definition, apzFactory, apzDefinitionFactory, apzRenderer, apzWritter) {
		var dis = {};
		dis.generate = generate;

		var outputPath = definition.outputPath || 'bin';
		function generate() {
			var apzDefinition = apzDefinitionFactory.create(definition);
			var apz = apzFactory.create(apzDefinition);
			var apzFiles = apzRenderer.render(apz);
			apzWritter.write(apzFiles, outputPath);
		}

		return dis;
	});