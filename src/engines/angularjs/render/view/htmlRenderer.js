define(['src/render/layoutRenderer'], 
	function (layoutRenderer){
		var dis = require('util')._extend({}, layoutRenderer);
		dis.renderButton = renderButton;
		
		function renderButton(text, action){
			return layoutRenderer.renderButton(text, action, 'ng-click');
		}
		
		return dis;
	});