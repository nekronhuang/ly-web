var expos = require('./controllers/expos'),
    contacts = require('./controllers/contacts'),
    sign = require('./controllers/sign'),
    invite = require('./controllers/invite'),
    render = require('./controllers/render'),
    rest = require('./controllers/rest'),
    stat = require('./controllers/stat'),
    settings = require('./controllers/settings'),
    filter = require('./tools/filter');

module.exports = function(app) {
    app.get('/', function(req, res, next) {
        console.log(req.header('x-forwarded-for') || req.connection.remoteAddress)
        if (req.session.user) {
            next();
            // var name = req.session.user.name||req.session.user.email;
            // res.render('layout', {
            //     name: name
            // });
        } else {
            res.render('index');
        }
    });

    app.get('/stat/email/open', stat.openEmail);
    app.get('/stat/email/redirect', stat.redirectUrl);

    app.get('/data/users/info/self', filter.restAuthorize, rest.getUserInfo);
    app.put('/data/users/changePwd/self', filter.restAuthorize, rest.changePwd);
    app.post('/data/users/newgroup/self', filter.restAuthorize, rest.pushNewGroup);
    app.get('/data/users/group/:oid', filter.restAuthorize, rest.getUsersByGroup);
    app.put('/data/users/edit/self', filter.restAuthorize, rest.editUser);

    app.get('/data/contacts/group/:oid', filter.restAuthorize, rest.getContactsByGroup);
    app.get('/data/contacts/tag/:name', filter.restAuthorize, rest.getContactsByTag);
    app.put('/data/contacts/edit/:oid', filter.restAuthorize, rest.editContact);
    app.get('/data/contacts/download', filter.restAuthorize, rest.downloadAllContacts);
    app.post('/data/contacts/download', filter.restAuthorize, rest.downloadContacts);
    app.put('/data/contacts/multiedit', filter.restAuthorize, rest.editContacts);
    app.delete('/data/contacts/group/:groupId', filter.restAuthorize, rest.deleteGroup);
    app.post('/data/contacts/nw', rest.nw);

    app.post('/data/notes/insert', filter.restAuthorize, rest.insertNewNote);

    app.get('/app/contacts', filter.authorize, contacts.showContacts);
    app.get('/app/contacts/detail', filter.authorize, contacts.showDetail);
    app.get('/app/contacts/upload', filter.authorize, contacts.showUpload);
    app.get('/app/contacts/add', filter.authorize, contacts.showAdd);
    app.post('/app/contacts/add', filter.authorize, contacts.add);
    app.post('/app/contacts/upload/start', filter.authorize, contacts.startUpload);
    app.post('/app/contacts/upload/end', filter.authorize, contacts.endUpload);

    app.get('/app/expos', filter.authorize, expos.showExpos);

    app.get('/app/index', function(req, res) {
        res.redirect('/index');
    });
    app.get('/index', function(req, res) {
        res.render('index');
    });

    app.get('/jade/:jade', render.renderJade);

    app.post('/app/sign/signup', sign.signup);
    app.post('/app/sign/login', sign.login);
    app.get('/app/sign/active', sign.active);
    app.get('/app/sign/logout', sign.logout);

    app.get('/app/settings', settings.showSettings);

    app.get('/email/company', function(req, res) {
        var config = require('./config');
        res.render('mail_templates/company_mail', {
            expo: 'TCT Asia 2015',
            account: 'aYyEA1',
            password: 'OIGWmdp3',
            stat: 'http://lianyun.me/stat/email/open?email=' + '123.com',
            company: {
                name: '上海佳梦亭商贸有限公司',
                example1: {
                    src: '/img/1/a.png',
                    title: '来访观众分时段流量图'
                },
                example2: {
                    src: '/img/1/b.png',
                    title: '来访观众所属的行业分布'
                },
                example3: {
                    src: '/img/1/c.png',
                    title: '来访观众感兴趣的产品和服务分布'
                },
                example4: {
                    src: '/img/1/d.png',
                    title: '来访观众参观目的分布'
                },
            },
            data: {
                num: 565,
                times: 596,
                rank: 25
            }
        });
    });

    app.get('/email/visitor2', function(req, res) {
        res.render('mail_templates/visitor_mail2');
    });

    app.get('/email/visitor', function(req, res) {
        res.render('mail_templates/visitor_mail', {
            expo: 'TCT Asia 2015',
            visitor: {
                name: '李明',
                gender: '男',
                data: [{
                    area: '3D打印与增材制造设备',
                    list: [{
                        name: '阿科玛（中国）投资有限公司上海分公司',
                        url: 'http://localhost:9180/stat/email/redirect?id=1&url=www.baidu.com',
                    }, {
                        name: '深圳市光华伟业实业有限公司',
                        url: 'http://www.lianyun.me/jade/list?id=0',
                    },{
                        name: '北京太尔时代科技有限公司',
                        product: ['产品设计开发', '手板制作'],
                        url: 'http://www.lianyun.me/jade/list?id=1',
                        number: 1
                    }],
                    url: 'http://localhost:9180/email/redirect?id=1&url=www.baidu.com'
                }, {
                    area: '原型制造与产品开发',
                    list: [{
                        name: '北京太尔时代科技有限公司',
                        product: ['产品设计开发', '手板制作'],
                        url: 'http://www.lianyun.me/jade/list?id=1',
                        number: 1
                    }, {
                        name: '深圳市齐乐模具科技有限公司',
                        product: ['手板制作'],
                        url: 'http://www.lianyun.me/jade/list?id=1',
                        number: 1
                    }, ],
                    url: 'http://localhost:9180/email/redirect?id=1&url=www.baidu.com'
                }, {
                    area: '3D扫描与数字化模块',
                    list: [{
                        name: '广州随尔激光快速成型有限公司',
                        url: 'http://www.lianyun.me/jade/list?id=3',
                        number: 1
                    }],
                    url: 'http://localhost:9180/email/redirect?id=1&url=www.baidu.com'
                }]
            }
        });
    });

    app.get('*', filter.authorize, function(req, res) {
        var name = req.session.user.name || req.session.user.email;
        res.render('layout', {
            name: name
        });
    });
}