define(['src/render/renderService'],
	function (renderService) {
		var js = renderService.class.renderer;

		var logger = 'logger';
		var $log = '$log';
		var $provide = '$provide';
		var $delegate = '$delegate';

		return {
			getFunctions: getFunctions,
			getReturn: getReturn,
			angularjs: {
				config: { getConfig: getAngularjsConfig }
			}
		};

		function getReturn() {
			var msg = 'msg';
			var executeConsoleLog = js.functions.execute(js.access($delegate, 'log'), msg);
			return js.objects.value({
				log: js.functions.declare({ parameters: [msg], body: executeConsoleLog })
			});
		}

		function getAngularjsConfig() {
			var config$log = js.functions.execute(js.access($provide, 'decorator'), [js.strings.value($log), logger]);
			return { parameters: $provide, body: config$log };
		}

		function getFunctions() {
			var _this = 'this';
			var config = 'config';
			var _logger = '_' + logger;
			var _config = '_' + config;

			var logServiceFn = {
				functionName: 'logServices',
				parameters: [logger, config],
				body: getLogServiceFnBody()
			};

			return [logServiceFn];

			function getLogServiceFnBody() {
				var _thisConfigServer = js.access(_this, js.concatJs('_', js.access(config, 'server')));
				return [
					js.variables.assign(js.access(_this, _logger), logger),
					js.variables.assign(js.access(_this, _config), js.variables.defaultValue(config, js.constants.emptyObject)),
					js.variables.assign(_thisConfigServer, js.variables.defaultValue(_thisConfigServer, js.constants.emptyObject))
				];
			}
		}
	});
	
/*
var logService = (function () {
		
		// function 
	
		logService.prototype.processArgs = function (_args) {
		    return moment().format('DD/MM/YYYY hh:mm:ss') + ' - ' + _args;
		};
		
		logService.prototype.debug = function (args) {
		    if (this._config.debug) {
		        this._logger.debug(this.processArgs(args));
		    }
		};
		logService.prototype.error = function (args) {
		    if (this._config.error) {
		        this._logger.error(this.processArgs(args));
		    }
		};
		logService.prototype.info = function (args) {
		    if (this._config.info) {
		        this._logger.info(this.processArgs(args));
		    }
		};
		logService.prototype.log = function (args) {
		    if (this._config.log) {
		        this._logger.log(this.processArgs(args));
		    }
		};
		logService.prototype.warn = function (args) {
		    if (this._config.warn) {
		        this._logger.warn(this.processArgs(args));
		    }
		};
        return logService;
    })();
*/