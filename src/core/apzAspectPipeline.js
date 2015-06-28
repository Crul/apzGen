define(['src/core/apzResolver'], function (apzResolver) {
	var aspects = [];

	function getAspects() {
		return aspects;
	}

	function addAspects(_aspects) {
		(_aspects || []).forEach(addAspect);
	}

	function addAspect(aspect) {
		if (typeof (aspect) === 'string')
			aspect = apzResolver.resolveAspect(aspect);
		
		var aspectsByName = aspects.filter(compareByAspectName);
		if (aspectsByName.length === 0)
			aspects.push(aspect);
	}

	function compareByAspectName(a1, a2) {
		return a1.aspectName == a2.aspectName;
	}

	return {
		get: getAspects,
		add: addAspects
	};
});