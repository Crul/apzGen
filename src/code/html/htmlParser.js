define(['src/system/fsSvc'], function (fsSvc) {
	var libxmljs = require('libxmljs');
	var dis = {};
	dis.parseFile = parseFile;
	dis.parse = parse;

	function parse(code) {
		var xml = libxmljs.parseXml(code);
		return parseNode(xml.root());
	}

	function parseFile(filePath, data, partials) {
		var code = fsSvc.readFile(filePath);
		return parse(code);
	}

	function parseNode(node) { // multiple returns
		var tag = node.name();
		if (tag === 'text')
			return node.text().trim();

		var htmlNode = [tag];
		htmlNode = setAttrs(htmlNode, node);
		htmlNode = setChildrenNodes(htmlNode, node);
		return htmlNode;
	}

	function setAttrs(htmlNode, node) { // multiple returns
		if (!node.attrs)
			return htmlNode;

		var attrs = getAttrJson(node.attrs() || []);
		if (attrs)
			htmlNode.push(attrs);

		return htmlNode;
	}

	function getAttrJson(attrs) {
		var attrsJson = {};
		var anyAttrSet = false;
		attrs.forEach(function (attr) {
			if (attr.value()) {
				attrsJson[attr.name()] = attr.value();
				anyAttrSet = true;
			}
		});
		return anyAttrSet ? attrsJson : undefined;
	}

	function setChildrenNodes(htmlNode, node) {
		var childHtmlNodes = node.childNodes().map(parseNode).filter(isNotNot);
		return htmlNode.concat(childHtmlNodes);
	}

	function isNotNot(elem) {
		return !!elem;
	}

	return dis;
});