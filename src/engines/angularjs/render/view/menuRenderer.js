define(['src/render/viewRenderer'], 
	function (viewRenderer){
		var dis = {};
		dis.render = render;
		
		function render(feature){
			return viewRenderer.renderMenu();
		}
		
		return dis;
	});