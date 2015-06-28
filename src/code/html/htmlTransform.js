define(['src/system/utils'], function (utils) {
	var util = require('util');
	var dis = {};
	dis.nodeVisitor = nodeVisitor;
	dis.extendAttributes = extendAttributes;
	dis.changeAttributeName = changeAttributeName;
	dis.clearMetadata = clearMetadata;

	function nodeVisitor(node, processNodeFns) {
		processNodeFns = utils.getArray(processNodeFns);

		if (node && node.length > 0) {
			processNodeFns.forEach(processNode);
			if (Array.isArray(node))
				node = node.map(processNodeElement);
		}
		return node;

		function processNode(processNodeFn) {
			node = processNodeFn(node);
		}

		function processNodeElement(element, elementIndex) {
			var isTag = (elementIndex === 0);
			return isTag ? element : nodeVisitor(element, processNodeFns);
		}
	}

	function changeAttributeName(node, oldAttribute, newAttribute) {
		if (node.length > 1 && node[1][oldAttribute]) {
			node[1][newAttribute] = node[1][oldAttribute];
			delete node[1][oldAttribute];
		}
	}

	function extendAttributes(node, attributes) {
		if (node.length < 2)
			node.push({});

		if (Array.isArray(node[1]))
			node.splice(1, 0, {});

		for (var attributeName in attributes) { // not [].forEach() because iterating {}
			var attributeValue = attributes[attributeName];
			var originalValue = node[1][attributeName];
			if (typeof (attributeValue) === 'object') {
				originalValue = originalValue || {};
				node[1][attributeName] = util._extend(originalValue || {}, attributeValue);
			} else {
				originalValue = originalValue || '';
				if (originalValue.indexOf(attributeValue) < 0)
					node[1][attributeName] = originalValue + (originalValue ? ' ' : '') + attributeValue;
			}
		}
	}

	function clearMetadata(node) {
		return nodeVisitor(node, clearNodeMetadata);
	}

	function clearNodeMetadata(node) {
		var hasMetadata = node.length > 1 && node[1]._meta;
		if (hasMetadata)
			delete node[1]._meta;
		return node;
	}

	return dis;
});