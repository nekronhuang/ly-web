var mail = require('../tools/mail'),
    config =require('../config'),
    models=require('../models'),
    statProxy=require('../proxy/stat');

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
                        src: config.storage.url+'example1.jpg',
                        title: '来访观众分时段流量图'
                    },
                    example2: {
                        src: config.storage.url+'example2.jpg',
                        title: '来访观众年龄分布'
                    },
                    url: config.website+'invite'
                },
                data:{
                    percent:76,
                    rank:2
                }
            }
        };
    mail.sendMail(req.query.email,mailOptions,function(err,info){
        console.log(info);
        res.status(200).end('ok');
    });
}