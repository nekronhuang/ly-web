var MongoClient = require('mongodb').MongoClient,
    config = require('../config');

MongoClient.connect(config.mongo.db, function (err, _db) {
    if (err) {
        process.exit(1);
    } else {
        exports.User=_db.collection('users');
        exports.Contact=_db.collection('contacts');
        exports.Note=_db.collection('notes');
    }
});