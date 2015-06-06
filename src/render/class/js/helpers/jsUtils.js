define(['src/render/codeRenderer'],
	function (codeRenderer) {
		var dis = {};

		dis.eol = ';\n';
		dis.access = accessRenderer;
		dis.concatJs = renderWrap(concatJs);
		dis.renderJs = renderJs;
		dis.renderJsNoEol = renderJsNoEol;
		dis.indent = indent;
		dis.renderWrap = renderWrap;

		function accessRenderer(leftSide, rightSide) {
			rightSide = dis.concatJs('.', rightSide);
			return dis.concatJs(leftSide, rightSide);
		}

		function concatJs(leftSide, rightSide) {
			return renderJsNoEol(leftSide) + renderJsNoEol(rightSide);
		}

		function renderJs(elem, avoidEol) { // multiple returns	
			if (elem === undefined) return '';

			var eol = (avoidEol === true ? '' : dis.eol);
			if (typeof (elem) === 'string')
				return elem + eol;

			if (elem.render)
				return elem.render() + eol;

			return JSON.stringify(elem) + eol;
		}

		function renderJsNoEol(elem) { // TODO refactor
			return renderJs(elem, true);
		}

		function indent(code) {
			return renderJs(code || '').replace(/^/, '\t').replace(/\n/g, '\n\t');
		}

		function renderWrap(fn) {
			function _wrappedFunction() {
				var _fn = fn;
				var _args = arguments;
				function render() {
					return _fn.apply(dis, _args);
				}
				return { render: render };
			}
			return _wrappedFunction;
		}

		return dis;
	});