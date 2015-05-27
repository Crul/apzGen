define(['src/render/viewRenderer'], 
	function (viewRenderer){
		var dis = {};
		dis.render = render;
		
		function render(feature){
			var featureName = feature.featureName;
			var view = viewRenderer.renderLink('back', '#/'); // TODO back > renderBackLink() { history.back }
			view += viewRenderer.renderLink('new ' + featureName, '#/' + featureName + '/edit/new'); // TODO access routes by properties
			view += viewRenderer.renderTitle(featureName);
			view += viewRenderer.renderTable(featureName, feature.model);
			return view;
		}
		
		return dis;
	});