define(['src/render/codeRenderer'],
	function (codeRenderer) {
		var dis = {};
		dis.renderWrap = codeRenderer.wrapRender; // TODO remove dependency through inheritance and rename

		dis.eol = ';\n';
		dis.concatJs = dis.renderWrap(concatJs);
		dis.access = accessRenderer;
		dis.renderJs = renderJs;
		dis.renderJsNoEol = renderJsNoEol;
		dis.indent = indent;

		function accessRenderer(leftSide, rightSide) {
			rightSide = dis.concatJs('.', rightSide);
			return dis.concatJs(leftSide, rightSide);
		}

		function concatJs(p1, p2, p3) {
			return renderJsNoEol(p1) + renderJsNoEol(p2) + renderJsNoEol(p3);
		}

		function renderJs(elem, avoidEol) { // multiple returns	
			if (elem === undefined)
				return '';

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

		function indent(code) { // TODO ¿codeRenderer?
			return renderJs(code || '').replace(/^/, '\t').replace(/\n/g, '\n\t');
		}

		return dis;
	});