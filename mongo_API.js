
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/test';
var _ = require('underscore');

var results = [];

MongoClient.connect(url, function(err, db) {
	assert.equal(null, err);
	results = db.collection('seed_2_tests').find()
});

console.log("mongo API hit...")
console.log("results: ", results)
// ASYNC ISSUES.

var list = function () {
  return _.clone(results);
};

// module.exports = { list: list };
module.exports = { list: results };