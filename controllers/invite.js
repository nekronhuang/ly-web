var mail = require('../tools/mail'),
    config = require('../config'),
    models = require('../models'),
    statProxy = require('../proxy/stat');

exports.inviteCompany = function(req, res) {
    // create company account password
    //expo companyname
    var mailOptions = {
        template: 'company_mail.jade',
        subject: '上海科技活动周参展报告',
        locals: {
            expo: '科技活动周',
            date: new Date().Format('yyyy年MM月dd日'),
            password: 'a7Yl2f',
            company: {
                name: '上海新时达机器人有限公司',
                example1: {
                    src: config.website +'/img/stream_in_time_500_350.png',
                    title: '来访观众分时段流量图'
                },
                example2: {
                    src: config.website +'/img/stream_in_date_500_350.png',
                    title: '来访观众每日人数'
                },
                example3:{
                    src: config.website +'/img/xingqu.png',
                    title: '来访观众兴趣领域'
                },
                example4:{
                    src: config.website +'/img/nianling.png',
                    title: '来访观众兴趣领域'
                },
                url: config.website + 'index'
            },
            data: {
                percent: 76,
                rank: 2
            }
        }
    };
    mail.sendMail(req.query.email, mailOptions, function(err, info) {
        console.log(info);
        res.status(200).end('ok');
    });
}

exports.c = function(a) {
    var access = '0qFcV5djdHEtc8ACa3elW10DI3EIoUZF2MRZ3cIx';
    var url = 'http://com-sinorvi-data2pic.qiniudn.com/';
    url += 'img/536ED4EA672621F7FE7C5BB3/stream_in_time_500_350.png'
    url += '?e=1451491200'
    var hmac_sha1 = require('crypto').createHmac('sha1', 'aLJT6WsbM7LXz-904hfAVezwMomrOTXGhKarZYqe');
    var str = hmac_sha1.update(url).digest('base64');
    str = str.replace(/\//g, '_').replace(/\+/g, '-');
    var end = url + '&token=' + access + ':' + str;
    console.log(end);
}

exports.inviteVisitor = function(req, res) {
    var mailOptions = {
        template: 'visitor_mail.jade',
        subject: '上海科技活动周参展报告',
        locals: {
            expo: '科技活动周',
            date: new Date().Format('yyyy年MM月dd日'),
            visitor: {
                name: '李明',
                gender: '男',
                data: [{
                    area: 'B区域（触摸科技）',
                    list: [{
                        name: '上海航宇科普中心',
                        product: ['飞行器', '模拟驾驶'],
                        url: 'http://www.lianyun.me/email/visitor2',
                        number: 2
                    }, {
                        name: '上海超级计算中心',
                        product: ['计算机', '云技术'],
                        url: 'http://www.lianyun.me/email/visitor2',
                        number: 1
                    }, {
                        name: '上海新世纪机器人有限公司',
                        product: ['机器人', '计算机', '通讯', '人工智能'],
                        url: 'http://www.lianyun.me/email/visitor2',
                        number: 1
                    }, {
                        name: '机器人联盟 上海新时达机器人有限公司',
                        url: 'http://www.lianyun.me/email/visitor2',
                        number: 1
                    }, ],
                    url: 'http://www.lianyun.me/email/visitor2'
                }, {
                    area: 'H区域（医学未来）',
                    list: [{
                        name: '上海市健康科技协会',
                        product: ['健康', '可穿戴设备'],
                        url: 'http://www.baidu.com',
                        number: 1
                    }, {
                        name: '上海天鹞医疗科技有限公司',
                        product: ['护理'],
                        url: 'http://www.baidu.com',
                        number: 1
                    }, {
                        name: '上海群天健康信息咨询有限公司',
                        product: ['护理', '可穿戴设备'],
                        url: 'http://www.baidu.com',
                        number: 1
                    }, {
                        name: '上海先德医疗设备有限公司',
                        number: 1
                    }, ],
                    url: 'http://www.baidu.com'
                }, {
                    area: 'F区域（共享生活）',
                    list: [{
                        name: '上海植物园',
                        url: 'http://www.baidu.com',
                        number: 1
                    }, {
                        name: '上海辰山植物园',
                        url: 'http://www.baidu.com',
                        number: 1
                    }],
                    url: 'http://www.baidu.com'
                }]
            }
        }
    };
    mail.sendMail(req.query.email, mailOptions, function(err, info) {
        console.log(err, info);
        res.status(200).end('ok');
    });
}