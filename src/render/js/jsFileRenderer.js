define(['src/render/codeRenderer'],
	function (codeRenderer){
		var dis = {};
		dis.render = render;
		dis.getFilename = getFilename;
				
		var variablePatternSeed = '\\/\\/\\{namePattern\\}|\\/\\*\\{namePattern\\}\\*\\/';
		function render(template, data){
			return codeRenderer.render(template, data, variablePatternSeed);
		}
		
		function getFilename(name){
			return name + '.js';
		}
			
		return dis;
	});