define(['src/default/render/classRenderer', 'src/default/render/viewRenderer'],
	function (classRenderer, viewRenderer) {
		return {
			seedPath: '',
			engines: [],
			fileExtensions: {
				class: classRenderer.fileExtension,
				view: viewRenderer.fileExtension
			}
		};
	});