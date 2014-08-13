var models=require('../models'),
    mongo=require('mongodb');

exports.getNotesByBelongTo = function(belongToId, callback) {
    var belongTo=new mongo.ObjectID(belongToId);
    models.Note.find({belongTo:belongTo}).sort({createAt:-1}).toArray(callback);
}

exports.getNotesByBelongTo=function(belongTo,callback){
    models.Note.find({belongTo:belongTo}).sort({createAt:-1}).toArray(callback);
}

exports.insertNote=function(newNote,callback){
    models.Note.insert(newNote,callback);
}