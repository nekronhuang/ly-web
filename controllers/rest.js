var fs = require('fs'),
    async = require('async'),
    mongo = require('mongodb'),
    crypto = require('crypto'),
    userProxy = require('../proxy/user'),
    contactProxy = require('../proxy/contact'),
    noteProxy = require('../proxy/note');

exports.getUserInfo = function (req, res) {
    async.waterfall([
        function (next) {
            userProxy.getUserById(req.session.user._id, {
                password: 0,
                active: 0,
                signupStatus: 0
            }, next);
        },
        function (user, next) {
            user.groupStatus = {
                contact: {},
                member: {}
            };
            async.parallel({
                contactCount: function (cb) {
                    var grouped = 0;
                    async.each(user.contactGroups, function (contactGroup, innerCb) {
                        contactProxy.countContactByGroup(req.session.user._id, contactGroup.groupId, function (err, count) {
                            contactGroup.number = count;
                            grouped += count;
                            innerCb(err);
                        });
                    }, function (err) {
                        cb(err, grouped);
                    });
                },
                memberCount: function (cb) {
                    var grouped = 0;
                    async.each(user.memberGroups, function (memberGroup, innerCb) {
                        userProxy.countMemberByGroup(req.session.user._id, memberGroup.groupId, function (err, count) {
                            memberGroup.number = count;
                            grouped += count;
                            innerCb(err);
                        });
                    }, function (err) {
                        cb(err, grouped);
                    });
                }
            }, function (err, counts) {
                next(err, user, counts);
            });
        },
        function(user, counts, next){
            user.tags=[];
            async.each(user.exhibitions,function(exhibition,innerCb){
                var obj={
                    display:exhibition,
                    number:0
                };
                contactProxy.countContactByTag(req.session.user._id, exhibition, function (err, count) {
                    obj.number = count;
                    user.tags.push(obj);
                    innerCb(err);
                });
            },function(err){
                next(err, user, counts);
            });
        },
        function (user, counts, next) {
            async.parallel([
                function (cb) {
                    contactProxy.countContactByGroup(req.session.user._id, function (err, count) {
                        user.groupStatus.contact.total = count;
                        user.groupStatus.contact.ungrouped = count - counts.contactCount;
                        cb(err, user);
                    });
                },
                function (cb) {
                    userProxy.countMemberByGroup(req.session.user._id, function (err, count) {
                        user.groupStatus.member.total = count;
                        user.groupStatus.member.ungrouped = count - counts.memberCount;
                        cb(err, user);
                    });
                }
            ], function (err) {
                next(err, user);
            });
        }
    ], function (err, user) {
        if (err) {
            console.log(err);
            res.send(500);
        } else {
            delete user.exhibitions;
            res.json({
                info: user
            });
        }
    });
}

exports.getUsersByGroup = function (req, res) {
    var groupId = req.params.oid;
    userProxy.getUsersByGroup(req.session.user._id, groupId, function (err, users) {
        if (err) {
            res.send(500);
        } else {
            res.json({
                data: users
            });
        }
    });
}

exports.changePwd=function(req,res){
    async.series([function(next){
        userProxy.getUserById(req.session.user._id,{password:1},function(err,user){
            var oldPwd=crypto.createHash('md5').update(req.body.oldPwd).digest('hex');
            if(user.password!=oldPwd){
                next('err');
            }else{
                next(err)
            }
        });
    },function(next){
        var newPwd=crypto.createHash('md5').update(req.body.newPwd).digest('hex');
        userProxy.editUserById(req.session.user._id,{password:newPwd},next)
    }],function(err){
        if(err){
            res.send(500);
        }else{
            req.session.destroy();
            res.send(200);
        }
    });
}

exports.editUser = function (req, res) {
    userProxy.editUserById(req.session.user._id, req.body.update, function (err, result) {
        if (err) {
            res.send(500);
        } else {
            res.send(200);
        }
    });
}

exports.editUsers = function (req, res) {
    var memberIds = req.params.oids.split(','),
        user = req.body.user;
    async.waterfall([
        function (next) {
            userProxy.editUserByIds(req.session.user._id, memberIds, req.body.update, function (err, result) {
                next(err);
            });
        },
        function (next) {
            var grouped = 0;
            async.each(user.memberGroups, function (memberGroup, cb) {
                userProxy.countMemberByGroup(req.session.user._id, memberGroup.groupId, function (err, count) {
                    memberGroup.number = count;
                    grouped += count;
                    cb(err);
                });
            }, function (err) {
                next(err, grouped);
            });
        },
        function (grouped, next) {
            userProxy.countMemberByGroup(req.session.user._id, function (err, count) {
                user.groupStatus.member.total = count;
                user.groupStatus.member.ungrouped = count - grouped;
                next(err);
            });
        }
    ], function (err) {
        if (err) {
            res.send(500);
        } else {
            res.json({
                info: user
            });
        }
    });
}

exports.getContactsByGroup = function (req, res) {
    var groupId = req.params.oid;
    async.waterfall([
        function (next) {
            if (req.query.filter) {
                contactProxy.getContactsByGroup(req.session.user._id, groupId, req.query.filter, next);
            } else {
                contactProxy.getContactsByGroup(req.session.user._id, groupId, next);
            }
        },
        function (contacts, next) {
            async.each(contacts, function (contact, cb) {
                noteProxy.getNotesByBelongTo(contact._id, function (err, notes) {
                    contact.notes = notes;
                    cb(err);
                });
            }, function (err) {
                next(err, contacts);
            });
        }
    ], function (err, contacts) {
        if (err) {
            res.send(500);
        } else {
            res.json({
                data: contacts
            });
        }
    });
}

exports.editContact = function (req, res) {
    var contactId = req.params.oid;
    contactProxy.editContactById(req.session.user._id, contactId, req.body, function (err, result) {
        if (err) {
            console.log(err);
            res.send(500);
        } else {
            res.send(200);
        }
    });
}

exports.editContacts = function (req, res) {
    var contactIds = req.params.oids.split(','),
        user = req.body.user;
    async.waterfall([
        function (next) {
            contactProxy.editContactByIds(req.session.user._id, contactIds, req.body.update, function (err, result) {
                next(err);
            });
        },
        function (next) {
            var grouped = 0;
            async.each(user.contactGroups, function (contactGroup, cb) {
                contactProxy.countContactByGroup(req.session.user._id, contactGroup.groupId, function (err, count) {
                    contactGroup.number = count;
                    grouped += count;
                    cb(err);
                });
            }, function (err) {
                next(err, grouped);
            });
        },
        function (grouped, next) {
            contactProxy.countContactByGroup(req.session.user._id, function (err, count) {
                user.groupStatus.contact.total = count;
                user.groupStatus.contact.ungrouped = count - grouped;
                next(err);
            });
        }
    ], function (err) {
        if (err) {
            res.send(500);
        } else {
            res.json({
                info: user
            });
        }
    });
}

exports.insertNewNote = function (req, res) {
    var newNote = {
        author: new mongo.ObjectID(req.session.user._id),
        content: req.body.newNoteContent,
        belongTo: new mongo.ObjectID(req.body.belongTo),
        createAt: Date.now()
    };
    noteProxy.insertNote(newNote, function (err, notes) {
        if (err) {
            res.send(500);
        } else {
            res.json({
                note: notes[0]
            });
        }
    });
}

exports.pushNewGroup = function (req, res) {
    var newGroup = {},
        newGroupId = new mongo.ObjectID().toString();
    newGroup[req.body.key] = req.body.value;
    newGroup[req.body.key].groupId = newGroupId;
    userProxy.pushNewGroup(req.session.user._id, newGroup, function (err, result) {
        if (err) {
            res.send(500);
        } else {
            res.send(newGroupId);
        }
    });
}

exports.deleteGroup=function(req,res){
    async.series([
        function(next){
            userProxy.deleteGroup(req.session.user._id,req.params.groupId,next);
        },
        function(next){
            contactProxy.deleteGroup(req.params.groupId,next);
        }
    ],function(err){
        if (err) {
            res.send(500);
        } else {
            res.send(200);
        }
    });
}