define(['definition', 'src/core/apzFactory', 'src/core/apzRenderer', 'src/core/apzWritter', 'src/system/logger'],
	function (definition, apzFactory, apzRenderer, apzWritter, logger) {
		var dis = {};
		dis.generate = generate;

		var defaultOutputPath = 'bin';

		function generate() {
			var apz = apzFactory.create(definition);
			var apzFiles = apzRenderer.render(apz);
			write(apzFiles);
			logger.log('\n\t apz generated!');
		}

		function write(apzFiles) {
			var outputPath = definition.outputPath || defaultOutputPath;
			apzWritter.write(apzFiles, outputPath);
		}

		return dis;
	});