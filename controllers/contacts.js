var fs=require('fs'),
    async=require('async'),
    iconv=require('iconv-lite'),
    mongo=require('mongodb'),
    models=require('../models'),
    contactProxy=require('../proxy/contact'),
    userProxy=require('../proxy/user'),
    noteProxy=require('../proxy/note');

exports.showUpload = function (req, res) {
    res.render('upload');
}

exports.showAdd = function (req, res) {
    res.render('add');
}

exports.add = function(req, res) {
    var newContact = req.body.newContact,
        newNote = req.body.newNote,
        user= req.body.user;
    newContact.cardid = Date.now().toString()+req.session.user.email;
    newContact.extra = [];
    newContact.group=req.body.group;
    newContact.tags = [];
    newContact.type = 1;
    newContact.belongTo = new mongo.ObjectID(req.session.user._id);
    newContact.copyFrom = newContact.belongTo;
    newContact.createAt = Date.now();
    newContact.updateAt = newContact.createAt;

    async.waterfall([
        function(next) {
            contactProxy.insertContact(newContact, function(err,contacts){
                next(err,contacts[0]._id);
            });
        },
        function(cid, next) {
            if(newNote.content.length){
                newNote.author = newContact.belongTo;
                newNote.belongTo=cid;
                newNote.createAt = newContact.createAt;
                noteProxy.insertNote(newNote, function(err,notes){
                    next(err,cid.toString());
                });
            }else{
                next(null,cid.toString());
            }
        },
        function (cid,next) {
            var grouped = 0;
            async.each(user.contactGroups, function (contactGroup, cb) {
                contactProxy.countContactByGroup(req.session.user._id, contactGroup.groupId, function (err, count) {
                    contactGroup.number = count;
                    grouped += count;
                    cb(err);
                });
            }, function (err) {
                next(err, grouped, cid);
            });
        },
        function (grouped,cid, next) {
            contactProxy.countContactByGroup(req.session.user._id, function (err, count) {
                user.groupStatus.contact.total = count;
                user.groupStatus.contact.ungrouped = count - grouped;
                next(err,cid);
            });
        }
    ], function(err,cid) {
        if (err) {
            res.send(500);
        } else {
            res.json({
                info:user,
                contactId:cid
            });
        }
    });
}

exports.showContacts = function (req, res) {
    res.render('contacts');
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

exports.startUpload=function(req,res){
    var type=req.files.file.headers['content-type'],
        tmpPath=req.files.file.path,
        fileName=req.files.file.name,
        mimeType=['application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','application/vnd.ms-excel.sheet.macroEnabled.12','application/vnd.ms-excel.sheet.binary.macroEnabled.12'],
        mapping={
            header:[],
            cardid:null,
            path:tmpPath
        };
    if(type==mimeType[0]){
        if(/csv$/.test(fileName)){
            var rs=fs.createReadStream(tmpPath),
                buf=new Buffer([]),
                rsContinue=true;
            rs.on('data',function(chunk){
                buf=Buffer.concat([buf,chunk]);
                if(rsContinue&&buf.toString().match(/\r\n/g).length>1){
                    rs.pause();
                    rsContinue=false;
                    rs.emit('next');
                };
            });
            rs.on('next',function(){
                rs.resume();
                var str=buf[0]==239&&buf[1]==187&&buf[2]==191?buf.toString():iconv.decode(buf,'gbk'),
                    lines=str.split('\r\n'),
                    rows=[];
                rows.push(lines[0].split(','));
                rows.push(lines[1].split(','));

                for(var i=0,len=rows[0].length;i<len;i++){
                    var line={};
                    if(rows[0][i]=='cardid'){
                        mapping.cardid=i;
                    }else{
                        line.display=rows[0][i];
                        line.value=rows[1][i];
                        line.key='';
                        mapping.header.push(line);
                    }
                }
                res.json({mapping:mapping});
            });
        }else{

        }
    }else if(type==mimeType[1]||type==mimeType[2]||type==mimeType[3]){

    }else{
        res.send('格式')
    }
}

exports.endUpload=function(req,res){
    var format=req.body.format,
        user=req.body.user,
        rs=fs.createReadStream(req.body.path),
        buf=new Buffer([]),
        increaseColumns=0;
    rs.on('data',function(chunk){
        buf=Buffer.concat([buf,chunk]);
    });
    rs.on('end',function(){
        var str=buf[0]==239&&buf[1]==187&&buf[2]==191?buf.toString():iconv.decode(buf,'gbk');
        var lines=str.split('\r\n');
        lines.pop();
        var insertContacts=[],
            extraArray=[];
            for(var k=0,len=user.settings.extraColumns;k<len;k++){
                extraArray.push('');
            }
            for(var l=0,len=format.length;l<len;l++){
                if(format[l]=='extra'){
                    var extra = {
                        field: 'extra[' + user.settings.extraColumns + ']',
                        displayName: '自定义',
                        visible: false,
                        enableCellEdit: true
                    }
                    user.settings.columnDefs.push(extra);
                    user.settings.extraColumns++;
                    increaseColumns++;
                }
            }
        for(var i=1,outer=lines.length;i<outer;i++){
            var line=lines[i].split(','),
                obj={
                    name:'',
                    gender:'',
                    email:'',
                    qq:'',
                    area:'',
                    department:'',
                    position:'',
                    company:'',
                    website:'',
                    address:'',
                    field:[],
                    mobile:[],
                    number:[],
                    extra:extraArray,
                    group:{},
                    tags:[]
                },
                inner=line.length;
            for(var j=0;j<inner;j++){
                var check=format[j];
                if(check){
                    if(typeof(obj[check])=='object'){
                        obj[check].push(line[j]);
                    }else{
                        obj[check]=line[j];
                    }
                }
            }
            if(req.body.group){
                obj.group=req.body.group;
            }
            obj.belongTo = new mongo.ObjectID(req.session.user._id);
            obj.copyFrom = obj.belongTo;
            obj.createAt=Date.now();
            obj.updateAt=Date.now();
            insertContacts.push(obj);
        }
        async.waterfall([
            function(next) {
                contactProxy.insertContact(insertContacts, function(err,contacts){
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
            },
            function(next){
                if(increaseColumns){
                    userProxy.editUserById(req.session.user._id,{settings:user.settings},next);
                }else{
                    next(null);
                }
            }
        ], function(err) {
            if (err) {
                res.send(500);
            } else {
                res.json({
                    info:user
                });
            }
        });
    });
}