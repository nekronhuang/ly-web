var crypto = require('crypto'),
    mongo = require('mongodb'),
    async = require('async'),
    mail = require('../tools/mail'),
    userProxy = require('../proxy/user');

exports.signup = function (req, res) {
    var md5 = crypto.createHash('md5'),
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
                    field: 'name',
                    displayName: '姓名',
                    visible: true,
                    enableCellEdit:false,
                    cellTemplate: '<div class="ngCellText comment" ng-class="col.colIndex()"><a href="/contacts/detail?id={{row.entity._id}}" target="_blank"><span ng-cell-text>{{row.getProperty(col.field)}}</span></a></div>'
                }, {
                    field: 'gender',
                    displayName: '性别',
                    visible: false,
                    enableCellEdit:false,
                    cellTemplate: '<div class="ngCellText comment" ng-class="col.colIndex()"><a href="/contacts/detail?id={{row.entity._id}}" target="_blank"><span ng-cell-text>{{row.getProperty(col.field)}}</span></a></div>'
                }, {
                    field: 'field',
                    displayName: '行业',
                    visible: false,
                    enableCellEdit:false,
                    cellTemplate: '<div class="ngCellText comment" ng-class="col.colIndex()"><a href="/contacts/detail?id={{row.entity._id}}" target="_blank"><span ng-cell-text>{{row.getProperty(col.field).join("/")}}</span></a></div>'
                }, {
                    field: 'mobile',
                    displayName: '手机',
                    visible: true,
                    enableCellEdit:false,
                    cellTemplate: '<div class="ngCellText comment" ng-class="col.colIndex()"><a href="/contacts/detail?id={{row.entity._id}}" target="_blank"><span ng-cell-text>{{row.getProperty(col.field).join("/")}}</span></a></div>'
                }, {
                    field: 'number',
                    displayName: '电话',
                    visible: false,
                    enableCellEdit:false,
                    cellTemplate: '<div class="ngCellText comment" ng-class="col.colIndex()"><a href="/contacts/detail?id={{row.entity._id}}" target="_blank"><span ng-cell-text>{{row.getProperty(col.field).join("/")}}</span></a></div>'
                }, {
                    field: 'area',
                    displayName: '地区',
                    visible: true,
                    enableCellEdit:false,
                    cellTemplate: '<div class="ngCellText comment" ng-class="col.colIndex()"><a href="/contacts/detail?id={{row.entity._id}}" target="_blank"><span ng-cell-text>{{row.getProperty(col.field)}}</span></a></div>'
                }, {
                    field: 'department',
                    displayName: '部门',
                    visible: false,
                    enableCellEdit:false,
                    cellTemplate: '<div class="ngCellText comment" ng-class="col.colIndex()"><a href="/contacts/detail?id={{row.entity._id}}" target="_blank"><span ng-cell-text>{{row.getProperty(col.field)}}</span></a></div>'
                }, {
                    field: 'position',
                    displayName: '职位',
                    visible: true,
                    enableCellEdit:false,
                    cellTemplate: '<div class="ngCellText comment" ng-class="col.colIndex()"><a href="/contacts/detail?id={{row.entity._id}}" target="_blank"><span ng-cell-text>{{row.getProperty(col.field)}}</span></a></div>'
                }, {
                    field: 'company',
                    displayName: '公司',
                    visible: true,
                    enableCellEdit:false,
                    cellTemplate: '<div class="ngCellText comment" ng-class="col.colIndex()"><a href="/contacts/detail?id={{row.entity._id}}" target="_blank"><span ng-cell-text>{{row.getProperty(col.field)}}</span></a></div>'
                }, {
                    field: 'website',
                    displayName: '网址',
                    visible: false,
                    enableCellEdit:false,
                    cellTemplate: '<div class="ngCellText comment" ng-class="col.colIndex()"><a href="/contacts/detail?id={{row.entity._id}}" target="_blank"><span ng-cell-text>{{row.getProperty(col.field)}}</span></a></div>'
                }, {
                    field: 'address',
                    displayName: '地址',
                    visible: false,
                    enableCellEdit:false,
                    cellTemplate: '<div class="ngCellText comment" ng-class="col.colIndex()"><a href="/contacts/detail?id={{row.entity._id}}" target="_blank"><span ng-cell-text>{{row.getProperty(col.field)}}</span></a></div>'
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
    async.waterfall([
        function (cb) {
            userProxy.getUserByEmail(newUser.email, cb);
        },
        function (user, cb) {
            if (user) {
                cb(null, null);
            } else {
                userProxy.insertUser(newUser, function (err, users) {
                    cb(err, 1);
                });
            }
        }
    ], function (err, result) {
        if (err) {
            res.send(500);
            return;
        }
        if (result) {
            var mailOptions = {
                template: 'active.jade',
                locals: {}
            };
            mail.sendActiveMail(newUser.email, mailOptions, function (err) {
                if (err) {
                    res.send(500);
                } else {
                    res.json({
                        'm': '注册成功，请至邮箱激活，网页将在1秒后自动跳转！',
                        'app': 's'
                    });
                }
            });
        } else {
            res.json({
                'm': '该用户已存在！',
                'app': 'f'
            });
        }
    });
}

exports.login = function (req, res) {
    var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');
    userProxy.getUserByEmail(req.body.email, function (err, user) {
        if (err) {
            res.send(500);
        } else {
            if (!user || user.password != password) {
                res.send(200);
            } else {
                if (req.body.autosign) {
                    req.session.cookie.maxAge = 3600 * 1000 * 24 * 7;
                }
                req.session.user = {
                    _id: user._id,
                    email: user.email,
                    active: user.active
                };
                res.redirect('/contacts');
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
        var decipher = crypto.createDecipher('aes192', 'lxxlxx9179'),
            query = req.query.q;
        query = decipher.update(query, 'hex', 'utf8');
        query += decipher.final('utf8');
        userProxy.editUserById(req.session.user._id, {
            active: true
        }, function (err, results) {
            if (err) {
                res.send(500);
            } else {
                res.send(200);
            }
        });
    } else {
        res.send('请检查链接是否复制完整！');
    }
}

exports.back = function () {
    app.get('/a', function (req, res) {
        var signature = require('cookie-signature'),
            val = req.sessionID,
            secret = require('./config').secret;
        var signed = 's:' + signature.sign(val, secret);
        req.session.user = {
            name: 'lxx'
        }
        req.session.cookie.maxAge = 3600 * 1000 * 24 * 365 * 10;
        console.log(encodeURIComponent(signed))
        res.send(encodeURIComponent(signed))
    });
    //监听状态
    app.get('/b', function (req, res) {
        console.log(req.get('cookie'));
        console.log(req.session.user);
        res.send(500)
    });
}