define([],
	function () {
		var dis = {};
		dis.create = create;

		function create(definition, app) {
			var dataservice = require('util')._extend({}, definition);
			var path = 'services';
			dataservice.apzFiles = [{ fileType: 'class', path: path, fileName: definition.featureName || 'dataservice' }];
			dataservice.factories = [path + '/localStorage.js'];
			return dataservice;
		}

		return dis;
	});