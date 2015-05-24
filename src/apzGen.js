define(['definition', 'src/apzGenFactory'], 
	function (definition, appFactory){
		var dis = {};
		dis.generate = generate;
	
		function generate(_definition) {
			appFactory.copySeed();
			appFactory.create(_definition || definition);
		}
	
		return dis;
	});