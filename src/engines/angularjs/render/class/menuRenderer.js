define(['src/render/classRenderer'], 
	function (classRenderer){
		var dis = {};
		dis.render = render;
		
		function render(feature) {
			var body = classRenderer.renderModelInitializacion(feature.model);
			return classRenderer.render(feature.name, body);
		}
		
		return dis;
		
	});