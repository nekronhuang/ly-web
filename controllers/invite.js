var mail = require('../tools/mail');

exports.inviteCompany = function(req, res) {
    var mailOptions = {
            template: 'company_mail.jade',
            subject: '邀请',
            locals: {
                expo: '科技活动周',
                date: new Date().Format('yyyy年MM月dd日'),
                password: '123321',
                company: {
                    name: '上海**信息',
                    example1: {
                        src: 'http://lianyun.qiniudn.com/nav.jpg',
                        title: '来访观众分时段流量图'
                    },
                    example2: {
                        src: 'http://lianyun.qiniudn.com/nav.jpg',
                        title: '来访观众年龄分布'
                    },
                    url: 'http://www.lianyun.me/invite'
                }
            }
        };
    mail.sendMail(req.query.email,mailOptions,function(err){
        res.status(200).end('ok');
    });
}