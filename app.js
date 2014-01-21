var dvdprofiler = require('./dvdprofiler');
var db = require('nano')('http://localhost:5984/dvd');
var util = require('util');


var file = "./data/collection.xml";
var importTimestamp = new Date();
var importTimestampMS = importTimestamp.valueOf()
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
		var updated, inserted = 0;
		transformed.forEach(function(media) {
			//util.log(media.id + "*" + media.collectionNumber + ": " + media.title);
			db.get(media.id, function(err, body){
				if(body===null){
					db.insert({"profilerdata": media, "importTimestamp": importTimestamp, "importTimestampMS": importTimestampMS}, media.id);
					//todo err handling
					inserted++;
				} else {
					body.profilerdata = media;
					body.importTimestamp = importTimestamp;
					body.importTimestampMS = importTimestampMS;
					db.insert(body, media.id);
					updated++;
				}
			});
		});
		util.log("Done.\nUpdated: " + updated + "\nInserted: " + inserted);
	});
});