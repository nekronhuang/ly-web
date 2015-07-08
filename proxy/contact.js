var models = require('../models'),
    mongo = require('mongodb');

exports.getContactsByGroup = function() {
    var filter = {
            createAt: 0,
            updateAt: 0,
            copyFrom: 0,
            belongTo: 0,
            group: 0
        },
        masterId = Array.prototype.shift.apply(arguments),
        groupId = Array.prototype.shift.apply(arguments),
        callback = Array.prototype.pop.apply(arguments),
        condition = arguments.length ? arguments[0] : null,
        query = {};
    query.belongTo = new mongo.ObjectID(masterId);
    if (groupId == 'ungrouped') {
        query.group = {};
    } else if (groupId != 'total') {
        query['group.groupId'] = groupId;
    }
    if (condition) {
        for (var key in condition) {
            var val = condition[key];
            query[key] = new RegExp(val);
        }
    }
    models.Contact.find(query, filter).toArray(callback);
}

exports.getContactsByTag = function() {
    var filter = {
            createAt: 0,
            updateAt: 0,
            copyFrom: 0,
            belongTo: 0,
            group: 0
        },
        masterId = Array.prototype.shift.apply(arguments),
        tagName = Array.prototype.shift.apply(arguments),
        callback = Array.prototype.pop.apply(arguments),
        condition = arguments.length ? arguments[0] : null,
        query = {};
    query.belongTo = new mongo.ObjectID(masterId);
    query.tags = tagName;
    if (condition) {
        for (var key in condition) {
            var val = condition[key];
            query[key] = new RegExp(val);
        }
    }
    models.Contact.find(query, filter).toArray(callback);
}

exports.insertContact = function(newContact, callback) {
    models.Contact.insert(newContact, callback);
}

exports.getContactById = function(id, callback) {
    models.Contact.findOne({
        _id: new mongo.ObjectID(id)
    }, callback);
}

exports.getContactsByIds = function(masterId, ids, callback) {
    var arr = ids.map(function(v) {
        return new mongo.ObjectID(v)
    });
    models.Contact.find({
        belongTo: new mongo.ObjectID(masterId),
        _id: {
            $in: arr
        }
    }).toArray(callback);
}

exports.editContactById = function(masterId, contactId, update, callback) {
    update.updateAt = Date.now();
    models.Contact.update({
        belongTo: new mongo.ObjectID(masterId),
        _id: new mongo.ObjectID(contactId)
    }, {
        $set: update
    }, callback);
}

exports.editContactByIds = function(masterId, contactIds, update, callback) {
    var range = [];
    for (var i = 0, len = contactIds.length; i < len; i++) {
        range.push(new mongo.ObjectID(contactIds[i]));
    }
    update.updateAt = Date.now();
    models.Contact.update({
        belongTo: new mongo.ObjectID(masterId),
        _id: {
            $in: range
        }
    }, {
        $set: update
    }, {
        multi: true
    }, callback);
}

exports.countContactByGroup = function() {
    var masterId = Array.prototype.shift.apply(arguments),
        callback = Array.prototype.pop.apply(arguments),
        groupId = arguments.length ? arguments[0] : null,
        query;
    if (groupId) {
        query = {
            belongTo: new mongo.ObjectID(masterId),
            'group.groupId': groupId
        };
    } else {
        query = {
            belongTo: new mongo.ObjectID(masterId)
        };
    }
    models.Contact.count(query, callback);
}

exports.countContactByTag = function(masterId, tag, callback) {
    models.Contact.count({
        belongTo: new mongo.ObjectID(masterId),
        tags: tag
    }, callback);
}

exports.deleteGroup = function(groupId, callback) {
    models.Contact.update({
        'group.groupId': groupId
    }, {
        $set: {
            group: {}
        }
    }, {
        multi: true
    }, callback);
}