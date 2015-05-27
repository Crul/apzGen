define(['src/render/layoutRenderer'], 
	function (layoutRenderer){
		var dis = {};
		dis.render = render;
		
		function render(feature){
			var ul = layoutRenderer.renderUnordererList([{
				liAttributes: 'ng-repeat="option in area.options"',
				html: layoutRenderer.renderLink('{{option.optionName}}','','ng-href="#/{{option.path}}"')
			}]);
			return layoutRenderer.renderTag('div', ul, 'ng-repeat="area in model.areas"');
		}
		
		return dis;
	});