define([], function () {
	var dis = {};

	dis.node = createNode;

	function createNode(tag, content, attributes) {
		var node = [tag];
		if (attributes)
			node.push(attributes);

		node = node.concat(content || []);
		return node;
	}

	return dis;
});