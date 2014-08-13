var async=require('async'),
    models=require('../models'),
    mongo=require('mongodb');

exports.getUserById=function(oid,filter,callback){
    var _id=new mongo.ObjectID(oid);
    models.User.findOne({_id:_id},filter,callback);
}

exports.getUserByEmail=function(email,callback){
    models.User.findOne({email:email},callback);
}

exports.getUsersByGroup=function(masterId,groupId,callback){
    var query={
        'master._id':new mongo.ObjectID(masterId)
    };
    if(groupId=='ungrouped'){
        query.group={};
    }else if(groupId!='total'){
        query['group.groupId']=groupId;
    }
    models.User.find(query).toArray(callback);
}

exports.insertUser=function(newUser,callback){
    models.User.insert(newUser, callback);
}

exports.editUserById=function(oid,update,callback){
    var _id=new mongo.ObjectID(oid);
    models.User.update({_id:_id},{$set:update},callback);
}

exports.editUserByIds=function(masterId,memberIds,update,callback){
    var range=[];
    for(var i=0,len=memberIds.length;i<len;i++){
        range.push(new mongo.ObjectID(memberIds[i]));
    }
    models.User.update({
        'master._id': new mongo.ObjectID(masterId),
        _id: {
            $in:range
        }
    }, {
        $set: update
    },{
        multi:true
    }, callback);
}

exports.pushNewGroup=function(oid,push,callback){
    var _id=new mongo.ObjectID(oid);
    models.User.update({_id:_id},{$push:push},callback);
}

exports.countMemberByGroup=function(){
    var masterId=Array.prototype.shift.apply(arguments),
        callback = Array.prototype.pop.apply(arguments),
        groupId=arguments.length ? arguments[0] : null,
        query;
    if(groupId){
        query={'master._id':new mongo.ObjectID(masterId),'group.groupId':groupId};
    }else{
        query={'master._id':new mongo.ObjectID(masterId)};
    }
    models.User.count(query,callback);
}

exports.deleteGroup = function(oid, groupId,callback) {
    var _id = new mongo.ObjectID(oid);
    async.series([function(next){
        models.User.update({
            _id: _id,
            'contactGroups.groupId':groupId
        }, {
            $unset: {
                'contactGroups.$':1
            }
        }, next);
    },function(next){
        models.User.update({
            _id:_id
        },{
            $pull:{
                'contactGroups':null
            }
        },{
            multi:true
        },next);
    }],callback);

}