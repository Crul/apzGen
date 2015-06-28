define(['src/system/logger', 'src/code/html/htmlTransform'],
	function (logger, htmlTransform) {
		var DOMBuilder = require('DOMBuilder');
		var html = require('html');
		var unformatedTags = 'bdo,em,strong,dfn,code,samp,kbd,var,cite,abbr,acronym,q,sub,sup,tt,i,b,big,small,u,s,strike,font,ins,del,pre,address,dt';
		var prettifyOptions = {
			indent_size: 2,
			// custom unformatted https://github.com/maxogden/commonjs-html-prettyprinter/blob/master/lib/html.js
			unformatted: unformatedTags.split(',')
		};
		var dis = {};
		dis.generate = generate;

		function generate(definition) {
			definition = htmlTransform.clearMetadata(definition);
			var htmlCode = DOMBuilder.build(definition).toString();
			return html.prettyPrint(htmlCode, prettifyOptions);
		}

		return dis;
	});