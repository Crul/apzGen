function context(){
	var dis = {};
	dis.locked = locked;

	var isLocked = false;
	function locked(_isLocked){
		if (_isLocked === undefined) return isLocked;
		isLocked = _isLocked;
	}
	
	// TODO context
	
	return dis;
}