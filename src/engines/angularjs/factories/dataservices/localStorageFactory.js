define([], function () {
	var dis = {};

	dis.create = create;

	var dataservice = 'dataservice';
	var apzFile = {
		fileType: 'class',
		path: 'seedwork/services/',
		fileName: dataservice,
		renderer: ''
	};
	var angularjsFactory = apzFile.path + dataservice + '.js';

	function create(definition) {
		apzFile.renderer = definition.featureType;

		var dataserviceFactory = { featureName: dataservice };
		dataserviceFactory.apzFiles = [apzFile];
		dataserviceFactory.angularjs = { factories: [angularjsFactory] };
		return dataserviceFactory;
	}

	return dis;
});
