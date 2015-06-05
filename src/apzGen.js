define(
	[
		'definition',
		'src/apzFactory',
		'src/apzFileFactory',
		'src/apzRenderer',
		'src/apzWritter',
		'src/system/logger'
	],
	function (definition, apzFactory, apzFileFactory, apzRenderer, apzWritter, logger) {
		var dis = {};
		dis.generate = generate;

		function generate(_definition) {
			var outputPath = 'bin' || _definition.outputPath;
			var apz = apzFactory.create(_definition || definition);
			var apzFiles = apzFileFactory.create(apz);
			var renderedFiles = apzRenderer.render(apzFiles, apz);
			apzWritter.write(renderedFiles, outputPath);
			logger.log('\n\t apz generated!');
		}

		return dis;
	});