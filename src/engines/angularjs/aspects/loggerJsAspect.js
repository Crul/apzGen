define(['src/system/logger', 'src/code/js/jsTransform', 'src/code/js/jsElements'],
	function (logger, jsTransform, jsElements) {
		var $log = '$log';
		var dis = {
			aspectName: 'angularjsLoggerJs',
			applyTo: applyTo,
			intercept: intercept
		};

		function applyTo(apzFile) {
			return apzFile.filePath.match(/\.js$/) && !apzFile.filePath.match(/logger\.js$/);
		}

		function intercept(node) {
			return jsTransform.nodeVisitor(node, addLogToFunctions);
		}

		var functionNodeTypePattern = /^Function(Declaration|Expression)$/;
		function addLogToFunctions(node) {
			var isFunction = node.type.match(functionNodeTypePattern);
			if (isFunction) {
				var parentType = node._parent.type;
				var isParentProgram = (parentType == 'Program');
				if (isParentProgram)
					jsTransform.addParamToFunction(node, $log);

				var isParentFunction = parentType.match(functionNodeTypePattern);
				if ((isParentProgram || isParentFunction) && is$logInScope(node))
					addLogToFunction(node);
			}
			return node;
		}

		function addLogToFunction(node) {
			var body = node.body.body;
			var functionName = node.id ? node.id.name : 'undefined function';
			logger.trace('loggerJsAspect adding logging to ' + functionName);
			var logMessage = jsElements.createLiteral('executing ' + functionName);
			var logExecution = jsElements.createCallFunction($log, 'log', logMessage);
			node.body.body = [jsElements.createExpressionStatement(logExecution)].concat(body);
		}

		function is$logInScope(node) { // multiple returns
			if (!node)
				return false;

			var is$logInParams = (node.params || []).filter(is$LogParam).length > 0;
			if (is$logInParams)
				return true;

			return is$logInScope(node._parent);
		}

		function is$LogParam(param) {
			return param.name == $log;
		}

		return dis;
	});