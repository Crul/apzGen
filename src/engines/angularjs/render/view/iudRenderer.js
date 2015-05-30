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
			var formContent = renderFormControls(feature.model.fields);
			var form = viewRenderer.renderForm(formContent, formAttributes, panelFormAttributes);

			return backButton + form + saveButton;
		}

		function renderFormControls(fields) {
			return (fields || []).map(renderFormControl).join('');
		}

		function renderFormControl(field) {// wrapped to avoid re-send second param (arrayIndex because of [].map())
			return viewRenderer.renderControl(field);
		}

		return dis;
	});