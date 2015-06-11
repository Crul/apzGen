define(['src/system/utils', 'src/engines/js/helpers/jsUtils'],
	function (utils, jsUtils) {
		
		return { create: create };

		function create(classRenderer) {
			var dis = {};
			var util = require('util');
			dis = util._extend(dis, classRenderer);
			dis = util._extend(dis, jsUtils);
			
			dis.fileExtension = 'js';

			var includes = ['Class', 'Objects', 'Strings', 'Arrays', 'Compare', 'Conditional', 'Constants', 'Functions', 'Loops', 'Notifier', 'Variables'];
			dis = utils.extendWithHelpers(dis, includes.map(includeToHelper));

			function includeToHelper(include) {
				return {
					propertyName: include.toLowerCase(),
					fileName: 'src/engines/js/helpers/js' + include
				};
			}

			return dis;

		}
	});