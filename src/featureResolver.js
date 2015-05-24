define([], 
	function (){
		var dis = {};
		dis.resolve = resolve;
		
		var fs = require('fs');
		var featuresPath = 'src/features/';
		function resolve(definition){
			var names = [ definition.name, definition.base, definition ];
			for (var n in names){
				var path = featuresPath + names[n] + '.js';
				if (fs.existsSync(path))
					return require(path);
			}
		}
		
		return dis;
	});