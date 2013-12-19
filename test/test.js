var chai = require('chai'),
	assert = chai.assert,
	expect = chai.expect,
	should = chai.should(); // Note that should has to be executed
var clz = require('../lib/gamecollection.js');

describe('Parse', function() {
	describe('#parseString()', function() {
		it('parsing of the xml should result in a gamecollection object', function(done) {
			clz.parser.parseString('<game>test</game>', function(err, result) {
				if (err) throw new Error('No Error expected');
				if (!result) {
					throw new Error('Result expected');
				}
				expect(result).to.have.property('game');
				done();
			});
		});
	});
	describe('#parseFile()', function() {
		it('parsing an unknown file should result in an error', function(done) {
			expect(clz.parser.parseFile('doesnotexist')).to.throw(Error);
		});
	});
});