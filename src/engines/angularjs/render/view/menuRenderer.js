define(['src/default/render/viewRenderer'],
	function (viewRenderer) {
		var dis = {};
		dis.render = render;

		function render(apzFile) {
			var liOptions = [{
				liAttributes: 'ng-repeat="option in area.options" style="margin-top: 12px;"',
				html: viewRenderer.renderLinkButton(
					'{{option.optionName}}',
					'#/{{option.path}}',
					'style="display: block;"')
			}];
			var ul = viewRenderer.renderUnorderedList(liOptions);
			return viewRenderer.renderTag('div', ul, 'ng-repeat="area in model.areas"');
		}

		return dis;
	});