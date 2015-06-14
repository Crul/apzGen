define(['src/system/logger', 'src/code/jsTransform', 'src/code/jsElements'],
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

		function addLogToFunctions(node) {
			// TODO difference between 'FunctionDeclaration' || 'FunctionExpression' ??
			if (node.type == 'FunctionDeclaration' || node.type == 'FunctionExpression') {
				switch (node._parent.type) {
					case 'Program':
						jsTransform.addParamToFunction(node, $log);
					//  no break;
					case 'FunctionDeclaration':
						if (is$logInScope(node))
							addLogToFunction(node);
						break;
				}

			}
			return node;
		}

		function addLogToFunction(node) {
			var body = node.body.body;
			var functionName = node.id ? node.id.name : 'undefined function';
			logger.debug('loggerJsAspect adding logging to ' + functionName);
			var logMessage = jsElements.literal('executing ' + functionName);
			var logExecution = jsElements.callFunction($log, 'log', logMessage);
			node.body.body = [jsElements.expressionStatement(logExecution)].concat(body);
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