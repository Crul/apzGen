define([], function () {
	var aspects = [];
	
	function getAspects() {
		return aspects;
	}
	
	function addAspects(_aspects) {
		(_aspects || []).forEach(addAspect);
	}

	function addAspect(aspect) {
		var aspectsByName = aspects.filter(compareByAspectName);
		if (aspectsByName.length === 0)
			aspects.push(aspect);
	}

	function compareByAspectName(a1, a2) {
		return a1.aspectName == a2.aspectName;
	}
	
	return {
		getAspects: getAspects,
		addAspects: addAspects
	};
});