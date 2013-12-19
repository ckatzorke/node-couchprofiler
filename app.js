var clz = require('./couchprofiler');
var db = require('nano')('http://localhost:5984/todos');
var util = require('util');

var file = "./data/collection.xml";
clz.parser.parseFile(file, function(err, result) {
	if (err) {
		util.log(err);
		return;
	}
	clz.transformer.transform(result, function(err, transformed) {
		if (err) {
			util.log(err);
			return;
		}
		util.log("Count: " + transformed.length);
		transformed.forEach(function(media) {
			util.log(media.collectionNumber + ": " + media.title);
			db.insert(media, media.id);
		});
	});
});