define(
	[
		'src/engines/js/helpers/jsUtils',
		'src/engines/js/helpers/jsConstants',
		'src/engines/js/helpers/jsVariables',
		'src/engines/js/helpers/jsFunctions'
	],
	function (jsUtils, jsConstants, jsVariables, jsFunctions) {
		var dis = {};

		dis.renderClass = renderClass;
		dis.renderBody = renderBody;

		function renderClass(classConfig) {
			classConfig = classConfig || {};
			classConfig.body = renderClassBody(classConfig);
			return jsFunctions.declare(classConfig).render();
		}

		function renderClassBody(classConfig) {
			var _this = 'dis';
			classConfig.isClass = true;
			classConfig._this = _this;
			classConfig.properties = classConfig.properties || [];
			classConfig.properties.push({ propertyName: _this, initialValue: jsConstants.emptyObject });
			classConfig.return = classConfig.return || _this;
			return renderBody(classConfig);
		}

		function renderBody(config) {
			config.body = (config.body || []);
			if (!Array.isArray(config.body))
				config.body = [config.body];

			var body = [];
			body = body.concat(config.body);
			body = body.concat((config.properties || []).map(_renderProperty));
			body = body.concat(getFunctions(config).map(_renderFunction));
			if (config.return)
				body.push(jsFunctions.return(config.return));

			return body;

			function _renderProperty(propertyConfig) {
				return renderProperty(propertyConfig, config._this);
			}

			function _renderFunction(fnConfig) {
				return renderFunction(fnConfig, config);
			}
		}

		function getFunctions(config) {
			return (config.functions || []).concat(config.getFunctions ? config.getFunctions() : []);
		}

		function renderProperty(propertyConfig, classThisProperty) {
			var propertyName = propertyConfig.propertyName || 'foo';
			var initialValue = propertyConfig.initialValue || jsConstants._undefined;
			var code;
			if (propertyConfig.isPublic) {
				var _this = classThisProperty || jsConstants._this;
				code = jsVariables.assign(jsUtils.access(_this, propertyName), initialValue);
			} else {
				code = jsVariables.declare(propertyName, initialValue);
			}
			return code;
		}

		function renderFunction(fnConfig, fnClass) {
			var code = [];
			var fnName = fnConfig.className || fnConfig.functionName;

			if (fnConfig.isPublic) {
				var _this = fnClass._this || jsConstants._this;
				var propertyName = jsUtils.access(_this,(fnConfig.isPublic.propertyName || fnName));
				code.push(jsUtils.concatJs(jsVariables.assign(propertyName, fnName), jsConstants.eol));
			}

			fnConfig.context = (fnClass.parameters || []).concat(fnClass.dependencies || []);
			fnConfig.body = renderBody(fnConfig);
			code = code.concat(jsFunctions.declare(fnConfig));
			return code.map(jsUtils.renderJs).join('') + jsConstants.eol;
		}

		return dis;
	});