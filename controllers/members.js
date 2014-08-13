var fs=require('fs'),
    async=require('async'),
    iconv=require('iconv-lite'),
    mongo=require('mongodb'),
    models=require('../models'),
    mail = require('../tools/mail'),
    contactProxy=require('../proxy/contact'),
    userProxy=require('../proxy/user'),
    noteProxy=require('../proxy/note');

exports.showMembers = function (req, res) {
    res.render('members');
}

exports.inviteMembers=function(req,res){
    var mailOptions = {
        template: 'active.jade',
        locals: {}
    };
    mail.sendInviteMail(req.body.invitees,mailOptions,function(err){

    });
}

exports.showDetail = function(req, res) {
    async.waterfall([
        function(next) {
            contactProxy.getContactById(req.query.id, next);
        },
        function(contact,next) {
            if(contact){
                noteProxy.getNotesByBelongTo(contact._id, function (err, notes) {
                    contact.notes = notes;
                    next(err,contact);
                });
            }else{
                next('none');
            }
        }
    ], function(err,contact) {
        if(err){
            console.error(err);
            res.send(500);
        }else{
            res.render('detail', {
                data: JSON.stringify(contact)
            });
        }
    });
}