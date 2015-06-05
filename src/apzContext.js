define(
	[
		'src/default/render/classRenderer',
		'src/default/render/viewRenderer',
	], 
	function (classRenderer, viewRenderer) {
		var dis = {};
		
		dis.seedPath = '';
		
		dis.engines = [];
		
		dis.fileExtensions = {
			class: classRenderer.fileExtension,
			view: viewRenderer.fileExtension
		};
		
		return dis;
	});