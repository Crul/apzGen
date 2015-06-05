function notifier(){
	var dis = {};
	dis.notify = notify;

	function notify(message){
		alert(message);
	}
		
	return dis;
}