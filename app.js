var dvdprofiler = require('./dvdprofiler');
var db = require('nano')('http://localhost:5984/todos');
var util = require('util');

var file = "./data/collection.xml";
dvdprofiler.parser.parseFile(file, function(err, result) {
	if (err) {
		util.log(err);
		return;
	}
	dvdprofiler.transformer.transform(result, function(err, transformed) {
		if (err) {
			util.log(err);
			return;
		}
		util.log("Count: " + transformed.length);
		transformed.forEach(function(media) {
			util.log(media.id + "*" + media.collectionNumber + ": " + media.title);
			db.insert(media, media.id);
		});
	});
});