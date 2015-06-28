define([], function () {
	var baseTmplPath = 'src/engines/angularjs/templates/';
	var htmlTmplPath = baseTmplPath + 'html/';
	var jsTmplPath = baseTmplPath + 'js/';
	var partialRelativePath = 'partial/';
	var tmplExtension = '.tmpl';

	function getTemplate(template) {
		return template + tmplExtension;
	}

	function getJs(template) {
		return getTemplate(jsTmplPath + template);
	}

	function getHtml(template) {
		return getTemplate(htmlTmplPath + template);
	}

	function getHtmlPartial(template) {
		return getTemplate(htmlTmplPath + partialRelativePath + template);
	}

	function getJsPartial(template) {
		return getTemplate(jsTmplPath + partialRelativePath + template);
	}

	return {
		html: {
			get: getHtml,
			getPartial: getHtmlPartial,
			partials: {
				backToListButton: getHtmlPartial('back-to-list-button'),
				saveButton: getHtmlPartial('save-button'),
				control: getHtmlPartial('control')
			},
			index: getHtml('index'),
			iud: getHtml('iud'),
			list: getHtml('list'),
			menu: getHtml('menu')
		},
		js: {
			get: getJs,
			getPartial: getJsPartial,
			app: getJs('app'),
			iud: getJs('iudCtrl'),
			list: getJs('listCtrl'),
			menu: getJs('menu'),
			loggerConfig: getJs('loggerConfig')
		}
	};
});