define(['src/render/renderService'],
	function (renderService) {
		var html = renderService.view.renderer;
		var dis = {};
		dis.render = render;

		function render(apzFile) {
			var liOptions = [{
				liAttributes: 'ng-repeat="option in area.options" style="margin-top: 12px;"',
				html: html.renderLinkButton(
					'{{option.optionName}}',
					'#/{{option.path}}',
					'style="display: block;"')
			}];
			var ul = html.renderUnorderedList(liOptions);
			return html.renderTag('div', ul, 'ng-repeat="area in model.areas"');
		}

		return dis;
	});