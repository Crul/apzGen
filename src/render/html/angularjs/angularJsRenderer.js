define(['src/render/layoutRenderer'], 
	function (layoutRenderer){
		var dis = require('util')._extend({}, layoutRenderer);
		dis.renderButton = renderButton;
		dis.renderMenu = renderMenu;
		
		function renderButton(text, action){
			return layoutRenderer.renderButton(text, action, 'ng-click');
		}
		
		function renderMenu(){
			var ul = layoutRenderer.renderUnordererList([{
				liAttributes: 'ng-repeat="option in area.options"',
				html: layoutRenderer.renderLink('{{option.name}}','','ng-href="#/{{option.path}}"')
			}]);
			return layoutRenderer.renderTag('div', ul, 'ng-repeat="area in model.areas"');
		}
		
		return dis;
	});