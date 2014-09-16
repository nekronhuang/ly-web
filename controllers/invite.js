var mail = require('../tools/mail'),
    config = require('../config'),
    models = require('../models'),
    statProxy = require('../proxy/stat');

exports.inviteCompany = function(req, res) {
    // create company account password
    //expo companyname
    var mailOptions = {
        template: 'company_mail.jade',
        subject: '邀请',
        locals: {
            expo: '科技活动周',
            date: new Date().Format('yyyy年MM月dd日'),
            password: 'a7Yl2f',
            company: {
                name: '上海斯墨信息科技有限公司',
                example1: {
                    src: config.storage.url + 'example1.jpg',
                    title: '来访观众分时段流量图'
                },
                example2: {
                    src: config.storage.url + 'example2.jpg',
                    title: '来访观众年龄分布'
                },
                url: config.website + 'invite'
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

exports.c=function(){
    var access='0qFcV5djdHEtc8ACa3elW10DI3EIoUZF2MRZ3cIx';
    var url='http://com-sinorvi-data2pic.qiniudn.com/';
    url+='img/536ED4EA672621F7FE7C5BB3/stream_in_time_500_500.png'
    url+='?e=1451491200'
    var hmac_sha1=require('crypto').createHmac('sha1', 'aLJT6WsbM7LXz-904hfAVezwMomrOTXGhKarZYqe');
    var str=hmac_sha1.update(url).digest('base64');
    str=str.replace(/\//g, '_').replace(/\+/g, '-');
    var end=url+'&token='+access+':'+str;
    console.log(end);
}

exports.inviteVisitor = function(req, res) {
    var mailOptions = {
        template: 'visitor_mail.jade',
        subject: '邀请',
        locals: {
            expo: '科技活动周',
            date: new Date().Format('yyyy年MM月dd日'),
            visitor: {
                name: 'hyt',
                gender: '男',
                data: [{
                    area: 'A区域',
                    list: [{
                        name: '上海公司',
                        product: ['产品1', '产品2'],
                        url: 'http://www.baidu.com',
                        number: 8
                    }, {
                        name: '北京公司',
                        product: ['产品44', '产品2', '产品891823'],
                        url: 'http://www.baidu.com',
                        number: 6
                    }, {
                        name: '南京公司',
                        product: ['产品1', '产品2'],
                        url: 'http://www.baidu.com',
                        number: 5
                    }, {
                        name: '武汉公司',
                        url: 'http://www.baidu.com',
                        number: 8
                    }, ],
                    url: 'http://www.baidu.com'
                }, {
                    area: 'B区域',
                    list: [{
                        name: '上海公司',
                        product: ['产品1', '产品2'],
                        url: 'http://www.baidu.com',
                        number: 8
                    }, {
                        name: '北京公司',
                        product: ['产品44', '产品2', '产品891823'],
                        url: 'http://www.baidu.com',
                        number: 6
                    }, {
                        name: '南京公司',
                        product: ['产品1', '产品2'],
                        url: 'http://www.baidu.com',
                        number: 5
                    }, {
                        name: '武汉公司',
                        number: 8
                    }, ],
                    url: 'http://www.baidu.com'
                }, ]
            }
        }
    };
    mail.sendMail(req.query.email, mailOptions, function(err, info) {
        console.log(info);
        res.status(200).end('ok');
    });
}