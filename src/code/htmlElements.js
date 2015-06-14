define([], function () {
	var dis = {};
	
	dis.htmlPage = createHtmlPage;
	dis.cssInclude = createCssInclude;
	dis.jsInclude = createJsInclude;
	dis.node = createNode;
	
	// TODO wrap tags in functions, splitted in files

	function createHtmlPage(definition) {
		var head = createNode('head', definition.head, definition.headAttributes);
		var body = createNode('body', definition.body, definition.bodyAttributes);
		return createNode('html', [head, body], definition.htmlAttributes);
	}

	function createCssInclude(file) {
		return createNode('link', { 'rel': 'stylesheet', 'href': file.filePath || file });
	}

	function createJsInclude(file) {
		return createNode('script', '', { 'src': file.filePath || file });
	}

	function createNode(tag, content, attributes) {
		var node = [tag];
		if (attributes)
			node.push(attributes);

		node = node.concat(content || []);
		return node;
	}

	return dis;
});