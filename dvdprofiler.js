var xml2js = require('xml2js');
var fs = require('fs');
var util = require('util');

/**
 * The parser, generates a raw list of parsed JSON from an exported collection.xml
 */
var collectionparser = (function() {
	return {
		"parseFile": function(fileName, callback) {
			util.log('Parsing ' + fileName);
			//todo encoding, xml is 1252
			var content = fs.readFileSync(fileName);
			collectionparser.parseString(content.toString('utf8'), callback);
		},
		"parseString": function(xmlString, callback) {
			var parser = new xml2js.Parser();
			parser.parseString(xmlString, function(err, result) {
				util.log('Parsing done...');
				if (err) {
					if (callback) {
						callback(err);
					} else {
						throw err;
					}
				} else {
					collectionparser.saveJson(result);
					callback(null, result);
				}
			});
		},
		"saveJson": function(json) {
			fs.writeFile('./data/collection.json', JSON.stringify(json), function(err) {
				if (err) {
					util.log("JSON could not be safed.");
				}
				util.log('JSON saved!');
			});
		}
	};
})();
/**
 * Transforms the parsed raw json in "normal" JSON, used by collection
 */
var listtransformer = (function() {
	return {
		"transform": function(json, callback) {
			var list = [];
			var media;
			var count = json.Collection.DVD.length;
			var current = 0;
			util.log("Parsing " + count + " entries...");
			json.Collection.DVD.forEach(function(dvd) {
				util.log(++current + "/" + count);
				media = {};

				media.id = dvd.ID[0];
				media.collectionNumber = dvd.CollectionNumber[0];
				media.title = dvd.Title[0];
				media.sortTitle = dvd.SortTitle[0];
				media.overview = dvd.Overview[0];
				media.actors = [];
				if (typeof(dvd.Actors[0].Actor) !== "undefined") {
					dvd.Actors[0].Actor.forEach(function(actor) {
						media.actors.push(actor.$);
					});
				}
				media.countryOfOrigin = dvd.CountryOfOrigin[0];
				dvd.Genres.forEach(function(genre) {
					if (typeof(genre.Genre !== "undefined")) {
						media.genres = genre.Genre;
					}
				});
				media.mediaType = [];
				if (dvd.MediaTypes[0].DVD[0] === "true") {
					media.mediaType.push("DVD");
				}
				if (dvd.MediaTypes[0].HDDVD[0] === "true") {
					media.mediaType.push("HDDVD");
				}
				if (dvd.MediaTypes[0].BluRay[0] === "true") {
					media.mediaType.push("BluRay");
				}
				media.productionYear = dvd.ProductionYear[0];
				media.profileTimeStamp = new Date(dvd.ProfileTimestamp[0]);
				if (typeof(dvd.PurchaseInfo[0].PurchaseDate) !== "undefined") {
					media.purchaseDate = new Date(dvd.PurchaseInfo[0].PurchaseDate[0]);
				}
				if (typeof(dvd.PurchaseInfo[0].PurchasePlace) !== "undefined") {
					media.purchasePlace = dvd.PurchaseInfo[0].PurchasePlace[0];
				}
				media.rating = dvd.Rating[0];
				media.ratingAge = dvd.RatingAge[0];
				if (typeof(dvd.Released) !== "undefined") {
					media.releaseDate = new Date(dvd.Released[0]);
				}
				media.review = dvd.Review[0].$.Film[0];
				dvd.Studios.forEach(function(studio) {
					if (typeof(studio.Studio) !== "undefined") {
						media.studios = studio.Studio;
					}
				});
				media.upc = dvd.UPC[0];

				list.push(media);
			});
			if (callback !== undefined) {
				callback(null, list);
			}
		}
	};
})();

exports.parser = collectionparser;
exports.transformer = listtransformer;