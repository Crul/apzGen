define(['src/render/viewRenderer'], 
	function (viewRenderer){
		var dis = {};
		dis.render = render;
		
		function render(feature){
			var name = feature.name;
			var view = viewRenderer.renderLink('back', '#/'); // TODO back > renderBackLink() { history.back }
			view += viewRenderer.renderLink('new ' + name, '#/' + name + '/edit/new');
			view += viewRenderer.renderTitle(name);
			view += viewRenderer.renderTable(name, feature.model);
			return view;
		}
		
		return dis;
	});