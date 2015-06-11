define(['src/engines/angularjs/render/class/services/loggerFunctions'],
	function (loggerFunctions) {
		var dis = {};
		dis.create = create;

		var apzFile = {
			fileType: 'class',
			path: 'seedwork/services/',
			fileName: 'logger.js',
			renderer: 'services/logger'
		};
		function create(definition) {
			var loggerFactory = {};

			loggerFactory.apzFiles = [apzFile];
			loggerFactory.angularjs = {
				config: [loggerFunctions.angularjs.config]
			};

			loggerFactory.renderPipeline = {
				class: ['src/engines/angularjs/render/class/services/loggerRendererFactory']
			};
			
			return loggerFactory;
		}

		return dis;
	});