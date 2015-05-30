define(['src/default/render/layoutRenderer'],
	function (layoutRenderer) {
		var dis = {};
		dis.render = render;

		function render(feature) {
			var liOptions = [{
				liAttributes: 'ng-repeat="option in area.options" style="margin-top: 12px;"',
				html: layoutRenderer.renderLinkButton(
					'{{option.optionName}}',
					'#/{{option.path}}',
					'style="display: block;"')
			}];
			var ul = layoutRenderer.renderUnorderedList(liOptions);
			return layoutRenderer.renderTag('div', ul, 'ng-repeat="area in model.areas"');
		}

		return dis;
	});