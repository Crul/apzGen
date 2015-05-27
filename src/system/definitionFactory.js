define(['src/system/logger'], function(logger){
	var dis = {};
	dis.init = init;
	
	function init(definition, defaultName){
		definition = definition || {};
		
		if (typeof(definition) === 'string')
			definition =  { featureName: definition };
		
		if (typeof(definition) === 'boolean')
			definition =  { featureName: defaultName };
		
		definition.featureName = definition.featureName || defaultName;
		if (typeof(definition.featureName) !== 'string') 
			logger.log('definitionFactory.init invalid featureName: ' + definition.featureName);
			
		return definition; 
	}
	
	return dis;
});