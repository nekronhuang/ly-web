var crypto=require('crypto'),
    async=require('async'),
    nodemailer=require('nodemailer'),
    jade=require('jade'),
    config=require('../config');

exports.sendActiveMail=function(email,options,callback){
    var cipher = crypto.createCipher('aes192', config.secretKey),
        WEBSITE='http://www.lianyun.me',
        html=jade.renderFile('./views/mail_templates/'+options.template,options.locals);
    href = cipher.update(email, 'utf8', 'hex');
    href += cipher.final('hex');
    href = WEBSITE+'/sign/active?q=' + href;
    var transport = nodemailer.createTransport('SMTP', {
            service: 'QQ',
            auth: {
                user: 'service@sinorvi.com',
                pass: config.secretKey
            }
        }),
        mailOptions = {
            from: 'service@sinorvi.com',
            to: email,
            subject: 'hello',
            html: html
        };
    transport.sendMail(mailOptions, function (err) {
        callback(err);
    });
}
