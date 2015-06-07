define([], function () {
	var util = require('util');
	
	var dis = {};
	dis.extendPipeline = extendPipeline;
	dis.extendWithHelpers = extendWithHelpers;
	dis.arrays = {
		distinct: distinct
	};

	function extendPipeline(baseRenderer, pipeline) {
		var dis = require(baseRenderer);
		pipeline.forEach(extendPipelineObject);
		return dis;

		function extendPipelineObject(factory) {
			var rendererFactory = require(factory);
			dis = util._extend(dis, rendererFactory.create(dis));
		}
	}

	function extendWithHelpers(dis, helpers) {
		helpers.forEach(setHelper);
		return dis;
		function setHelper(helper) {
			dis[helper.propertyName] = require(helper.fileName);
		}
	}

	function distinct(array, compareFn) {
		compareFn = compareFn || compareValueFn;

		var newArray = [];
		(array || []).forEach(addIfNotExists);
		return newArray;

		function addIfNotExists(elemToAdd) {
			var existingElems = newArray.filter(function (elem) {
				return compareFn(elem, elemToAdd);
			}).length;

			if (existingElems === 0)
				newArray.push(elemToAdd);
		}

		function compareValueFn(a, b) {
			return a == b;
		}
	}

	return dis;
});