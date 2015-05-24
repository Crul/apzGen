// TODO rename definitionFactory
define([], function(){
	var dis = this;
	dis.init = init;
	
	function init(definition, defaultName){
		definition = definition || {};
		
		if (typeof(definition) === 'string')
			definition =  { name: definition };
		
		if (typeof(definition) === 'boolean')
			definition =  { name: defaultName };
		
		definition.name = definition.name || defaultName || 'name';
		return definition; 
	}
	
	return dis;
});