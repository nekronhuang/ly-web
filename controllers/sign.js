var crypto = require('crypto'),
    mongo = require('mongodb'),
    async = require('async'),
    mail = require('../tools/mail'),
    config =require('../config'),
    userProxy = require('../proxy/user');

exports.signup = function (req, res) {
    var md5 = crypto.createHash('md5'),
        singleTemplate='<div class="ngCellText comment" ng-class="col.colIndex()"><a href="/contacts/detail?id={{row.entity._id}}"><span ng-cell-text>{{row.getProperty(col.field)}}</span></a></div>',
        multiTemplate='<div class="ngCellText comment" ng-class="col.colIndex()"><a href="/contacts/detail?id={{row.entity._id}}"><span ng-cell-text>{{row.getProperty(col.field).join("/")}}</span></a></div>',
        newUser = {
            name:'',
            email: req.body.email,
            password: md5.update(req.body.password).digest('hex'),
            master: {},
            group:{},
            exhibitions:[],
            memberGroups: [],
            contactGroups: [],
            settings: {
                columnDefs: [{
                    field: 'time',
                    displayName: '来访时间',
                    visible: true,
                    enableCellEdit:false,
                    cellTemplate: singleTemplate
                }, {
                    field: 'name',
                    displayName: '姓名',
                    visible: true,
                    enableCellEdit:false,
                    cellTemplate: singleTemplate
                }, {
                    field: 'mobile',
                    displayName: '手机',
                    visible: true,
                    enableCellEdit:false,
                    cellTemplate: multiTemplate
                }, {
                    field: 'number',
                    displayName: '电话',
                    visible: false,
                    enableCellEdit:false,
                    cellTemplate: multiTemplate
                },{
                    field: 'email',
                    displayName: '邮箱',
                    visible: true,
                    enableCellEdit:false,
                    cellTemplate: singleTemplate
                }, {
                    field: 'country',
                    displayName: '国家',
                    visible: false,
                    enableCellEdit:false,
                    cellTemplate: singleTemplate
                }, {
                    field: 'area',
                    displayName: '地区',
                    visible: false,
                    enableCellEdit:false,
                    cellTemplate: singleTemplate
                }, {
                    field: 'position',
                    displayName: '职位',
                    visible: true,
                    enableCellEdit:false,
                    cellTemplate: singleTemplate
                }, {
                    field: 'company',
                    displayName: '公司',
                    visible: true,
                    enableCellEdit:false,
                    cellTemplate: singleTemplate
                }, {
                    field: 'website',
                    displayName: '网址',
                    visible: false,
                    enableCellEdit:false,
                    cellTemplate: singleTemplate
                }, {
                    field: 'address',
                    displayName: '地址',
                    visible: false,
                    enableCellEdit:false,
                    cellTemplate: singleTemplate
                }, {
                    field: 'notes[0]',
                    displayName: '备注',
                    visible: false,
                    enableCellEdit:false,
                    width: '220px',
                    cellTemplate: '<div class="ngCellText comment" ng-class="col.colIndex()"><a href="/contacts/detail?id={{row.entity._id}}" target="_blank"><span ng-cell-text>{{row.getProperty(col.field).createAt|date:"yyyy-M-dd"}} {{row.getProperty(col.field).content}}</span></a></div>'
                }],
                extraColumns: 0
            },
            active: false,
            appStatus: {},
            signupStatus: {
                timestamp: Date.now(),
                type:1
            }
        };
        if(req.body.exhibition){
            newUser.exhibitions.push(req.body.exhibition);
        }
    async.waterfall([
        function (cb) {
            userProxy.getUserByEmail(newUser.email, cb);
        },
        function (user, cb) {
            if (user) {
                cb(null, null);
            } else {
                userProxy.insertUser(newUser, function (err, users) {
                    cb(err, users[0]);
                });
            }
        }
    ], function (err, user) {
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
        }
        if (user) {
            if(req.headers.accept){
                res.json({
                    'm': '注册成功，请至邮箱激活，网页将在1秒后自动跳转！',
                    'app': 's'
                });
            }
        } else {
            res.json({
                'm': '该用户已存在！',
                'app': 'f'
            });
        }
    });
}

exports.login = function (req, res) {
    console.log(req.body.password);
    var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');
    userProxy.getUserByEmail(req.body.email, function (err, user) {
        if (err) {
            res.sendStatus(500);
        } else {
            console.log(user.password,password);
            if (!user || user.password != password) {
                res.redirect('/');
            } else {
                if(req.headers.accept){
                    console.log(1);
                    req.session.cookie.maxAge = 3600 * 1000 * 24 * 7;
                    req.session.user = {
                        _id: user._id,
                        email: user.email,
                        name:user.name,
                        active: user.active
                    };
                    res.redirect('/');
                }else{
                    var signature = require('cookie-signature'),
                        val = req.sessionID,
                        secret = config.mongo.secret;
                    var signed = 's:' + signature.sign(val, secret);
                    req.session.user = {
                        _id: user._id,
                        email: user.email,
                        active: user.active
                    };
                    req.session.cookie.maxAge = 3600 * 1000 * 24 * 365 * 10;
                    res.json({
                        'user':{
                            _id:user._id.toString(),
                            email:user.email
                        },
                        'cookie':encodeURIComponent(signed),
                        'app': 's'
                    });
                }
            }
        }
    });
}

exports.logout = function (req, res) {
    req.session.destroy();
    res.redirect('/');
}

exports.active = function (req, res) {
    //res.charset='utf-8';
    if (req.query.q) {
        var decipher = crypto.createDecipher('aes192', config.crypto.key),
            query = req.query.q;
        query = decipher.update(query, 'hex', 'utf8');
        query += decipher.final('utf8');
        userProxy.editUserById(req.session.user._id, {
            active: true
        }, function (err, results) {
            if (err) {
                res.sendStatus(500);
            } else {
                res.sendStatus(200);
            }
        });
    } else {
        res.sendStatus('请检查链接是否复制完整！');
    }
}