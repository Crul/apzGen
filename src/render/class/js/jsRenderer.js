define(
	[
		'src/render/codeRenderer',
		'src/render/class/js/helpers/jsUtils',
		'src/render/class/js/helpers/jsArrays',
		'src/render/class/js/helpers/jsCompare',
		'src/render/class/js/helpers/jsConditional',
		'src/render/class/js/helpers/jsConstants',
		'src/render/class/js/helpers/jsFunctions',
		'src/render/class/js/helpers/jsLoops',
		'src/render/class/js/helpers/jsNotifier',
		'src/render/class/js/helpers/jsVariables'
	],
	function (codeRenderer, jsUtils, jsArrays, jsCompare, jsConditional, jsConstants, jsFunctions, jsLoops, jsNotifier, jsVariables) {
		var dis = {};
		dis = require('util')._extend(dis, codeRenderer);
		dis = require('util')._extend(dis, jsUtils);

		dis.fileExtension = 'js';

		dis.arrays = jsArrays;
		dis.compare = jsCompare;
		dis.conditional = jsConditional;
		dis.constants = jsConstants;
		dis.functions = jsFunctions;
		dis.loops = jsLoops;
		dis.notifier = jsNotifier;
		dis.variables = jsVariables;

		dis.return = jsFunctions.return; // TODO move to functions?

		return dis;
	});