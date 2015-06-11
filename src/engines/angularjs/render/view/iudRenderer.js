define(['src/render/renderService'],
	function (renderService) {
		var html = renderService.view.renderer;
		var dis = {};
		dis.render = render;

		var formAttributes = '';
		var panelFormAttributes = 'style="margin-top: 24px;"';
		function render(apzFile) {
			var feature = apzFile.feature;
			var fields = feature.angularjs.model.fields || [];
			var backButton = html.renderLinkButton('back', '#/' + feature.featureName + '/list'); // TODO access routes by properties
			var saveButton = html.renderButton('save', 'save()');
			var formContent = renderFormControls(fields);
			var form = html.renderForm(formContent, formAttributes, panelFormAttributes);

			return backButton + form + saveButton;
		}

		function renderFormControls(fields) {
			return (fields || []).map(renderFormControl).join('');
		}

		function renderFormControl(field) {
			// wrapped to avoid re-send second param (arrayIndex because of [].map())
			return html.renderControl(field);
		}

		return dis;
	});