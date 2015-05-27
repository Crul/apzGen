define(
	[
		'src/render/classRenderer',
		'src/render/viewRenderer',
	], 
	function (classRenderer, viewRenderer) {
		var dis = {};
		
		dis.engines = [];
		
		dis.fileExtensions = {
			class: classRenderer.fileExtension,
			view: viewRenderer.fileExtension
		};
		
		return dis;
	});