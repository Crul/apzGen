define(['src/code/html/htmlElements', 'src/code/html/htmlTransform'],
	function (htmlElements, htmlTransform) {
		var formCssClasses = {
			form: 'form-horizontal',
			formBody: 'panel panel-default',
			formContainer: 'container'
		};
		var dis = {};
		dis.process = processForm;

		function processForm(node) {
			if (node[0] == 'form' && !isProcessedForm(node)) {
				htmlTransform.extendAttributes(node, { 'class': formCssClasses.form, _meta: { processed: true } });
				// TODO move styles to CSS
				var panelBody = htmlElements.node('div', [node], { 'class': formCssClasses.formBody, style: 'padding: 24px;' });
				// TODO move styles to CSS
				var formContainer = htmlElements.node('div', [panelBody], { 'class': formCssClasses.formContainer, style: 'margin-top: 24px;' });
				node = formContainer;
			}
			return node;
		}

		function isProcessedForm(node) {
			return (node.length > 1 && node[1]._meta && node[1]._meta.processed);
		}

		return dis;
	});