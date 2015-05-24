define(['definition', 'src/apzGenFactory', 'src/system/fileWriter'], 
	function (definition, appFactory, fileWriter){
		var dis = {};
		dis.generate = generate;
	
		function generate(_definition) {
			fileWriter.copyFolder('seed', 'bin');
			appFactory.create(_definition || definition);
		}
	
		return dis;
	});