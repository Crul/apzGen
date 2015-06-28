define([], function () {
	var dis = {};
	dis.create = create;

	function create(filePath, template, model, partials) {
		return {
			filePath: filePath,
			template: template,
			model: model,
			partials: partials
		};
	}

	return dis;
});