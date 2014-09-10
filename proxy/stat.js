var models=require('../models'),
    mongo=require('mongodb');

exports.insertStat=function(newStat,callback){
    models.Stat.insert(newStat,callback);
}