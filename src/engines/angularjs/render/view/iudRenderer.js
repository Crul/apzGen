define(['src/render/viewRenderer'], 
	function (viewRenderer){
		var dis = {};
		dis.render = render;
		
		function render(feature){
			feature.model = feature.model || {};
			var view = (feature.model.fields || []).map(viewRenderer.renderControl).join('');				
			view += viewRenderer.renderButton('save', 'save()');
			view = viewRenderer.renderForm(view);			
			view = viewRenderer.renderLink('back', '#/' + feature.name + '/list') + view;
			return view;
		}
		
		return dis;
	});
		