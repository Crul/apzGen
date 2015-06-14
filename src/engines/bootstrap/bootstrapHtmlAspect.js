define(['src/code/htmlElements', 'src/code/htmlTransform'],
	function (htmlElements, htmlTransform) {
		var bodyCssClass = 'container';
		var tableCssClass = 'table table-striped table-bordered table-hover';
		var formCssClasses = {
			form: 'form-horizontal',
			formBody: 'panel panel-default',
			formContainer: 'container'
		};
		var controlCssClasses = {
			label: 'col-xs-3 control-label',
			input: 'form-control',
			inputDiv: 'col-xs-9',
			groupDiv: 'form-group'
		};
		var btnCssClass = 'btn btn-default';
		var unorderedListCssClass = 'list-unstyled';

		var dis = {
			aspectName: 'boostrapHtml',
			applyTo: applyTo,
			intercept: intercept
		};

		function applyTo(apzFile) {
			return apzFile.filePath.match(/.html$/);
		}

		function intercept(code) {
			var processNodeFns = [
				processBody,
				processTable,
				processForm,
				processControl,
				processButton,
				processUnorderedList
			];
			code = htmlTransform.nodeVisitor(code, processNodeFns);
			return code;
		}

		function processTable(node) {
			if (node[0] == 'table')
				htmlTransform.extendAttributes(node, { 'class': tableCssClass });

			return node;
		}

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

		function processBody(node) {
			if (node[0] == 'body')
				htmlTransform.extendAttributes(node, { 'class': bodyCssClass });
			return node;
		}

		function processControl(node) {
			if (isControlNode(node)) {
				var input = node[2];
				htmlTransform.extendAttributes(input, { 'class': controlCssClasses.input });
				var inputDiv = htmlElements.node('div', [input], { 'class': controlCssClasses.inputDiv });
				node[2] = inputDiv;

				htmlTransform.extendAttributes(node[1], { 'class': controlCssClasses.label });
				htmlTransform.extendAttributes(node, { 'class': controlCssClasses.groupDiv });
			}
			return node;
		}

		function isControlNode(node) {
			return node.length > 2 &&
				node[1].length > 0 && node[1][0] == 'label' &&
				node[2].length > 0 && node[2][0] == 'input';
		}

		function processButton(node) {
			if (node[0] == 'button' || node[0] == 'a')
				htmlTransform.extendAttributes(node, { 'class': btnCssClass });
			return node;
		}

		function processUnorderedList(node) {
			if (node[0] == 'ul')
				htmlTransform.extendAttributes(node, { 'class': unorderedListCssClass });
			return node;
		}

		return dis;
	});