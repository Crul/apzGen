define(
	[
		'definition', 
		'src/apzFactory', 
		'src/apzFileFactory', 
		'src/apzRenderer',
		'src/system/fsService'
	], 
	function (definition, apzFactory, apzFileFactory, apzRenderer, fsService){
		var dis = {};
		dis.generate = generate;
		
		function generate(_definition) {
			var app = apzFactory.create(_definition || definition);
			var apzFiles = apzFileFactory.create(app);
			var renderedFiles = apzRenderer.render(apzFiles, app);
			// app generation first because we don't want to delete bin folder if it fails
			fsService.clearFolder('bin');
			fsService.copyFolder('seed', 'bin');
			renderedFiles.forEach(fsService.writeFile);
		}
	
		return dis;
	});