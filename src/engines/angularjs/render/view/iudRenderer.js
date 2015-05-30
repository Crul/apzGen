define(['src/default/render/viewRenderer'],
	function (viewRenderer) {
		var dis = {};
		dis.render = render;

		var formAttributes = '';
		var panelFormAttributes = 'style="margin-top: 24px;"';
		function render(feature) {
			feature.model = feature.model || {};
			var backButton = viewRenderer.renderLinkButton('back', '#/' + feature.featureName + '/list'); // TODO access routes by properties
			var saveButton = viewRenderer.renderButton('save', 'save()');
			var formContent = (feature.model.fields || []).map(viewRenderer.renderControl).join('');
			var form = viewRenderer.renderForm(formContent, formAttributes, panelFormAttributes);

			return backButton + form + saveButton;
		}

		return dis;
	});