function logger($delegate) {
	var dis = $delegate;
	
	/*new logServices($delegate);
	function logServices(logger) {
		this._logger = logger;		
		this.log = log;		
		function log (msg) {
			$delegate.log(msg);
		}
	}*/
	return dis;
}