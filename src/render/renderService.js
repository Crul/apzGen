define(['src/apzContext'],
	function (apzContext) {
		var util = require('util');
		var codeRenderer = require('src/render/codeRenderer');
		var classRenderer = util._extend({}, codeRenderer);
		var viewRenderer = util._extend({}, codeRenderer);

		var dis = {
			class: {
				renderer: classRenderer,
				addRenderer: addClassRenderer
			},
			view: {
				renderer: viewRenderer,
				addRenderer: addViewRenderer
			}
		};

		function addClassRenderer(rendererFactory) {
			addRenderer(dis.class, rendererFactory);
			apzContext.fileExtensions.class = dis.class.renderer.fileExtension || apzContext.fileExtensions.class;
		}

		function addViewRenderer(rendererFactory) {
			addRenderer(dis.view, rendererFactory);
			apzContext.fileExtensions.view = dis.view.renderer.fileExtension || apzContext.fileExtensions.view;
		}

		function addRenderer(classOrViewObj, rendererFactory) {
			var renderer = classOrViewObj.renderer;
			classOrViewObj.renderer = util._extend(renderer, rendererFactory.create(renderer));

		}

		return dis;
	});