define(
	[
		'definition', 
		'src/apzFactory', 
		'src/apzFileFactory', 
		'src/apzRenderer',
		'src/system/fsService',
		'src/system/logger'
	], 
	function (definition, apzFactory, apzFileFactory, apzRenderer, fsService, logger){
		var dis = {};
		dis.generate = generate;
		
		function generate(_definition) {
			var apz = apzFactory.create(_definition || definition);
			var apzFiles = apzFileFactory.create(apz);
			var renderedFiles = apzRenderer.render(apzFiles, apz);
			// apz generation first because we don't want to delete bin folder if it fails
			fsService.clearFolder('bin');
			fsService.copyFolder('seed', 'bin');
			fsService.writeFiles(renderedFiles);
			
			logger.log('\n\t apz generated!');
		}
	
		return dis;
	});