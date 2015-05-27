define(['src/engines/js/jsFunctionRenderer'],
	function (jsFunctionRenderer) {
		var dis = {};
		dis.render = render;

		function render(dataservice, app) {
			return jsFunctionRenderer.render(dataservice.featureName, 'return {}; // TODO dataservice');
		}

		return dis;

	});